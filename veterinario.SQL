--CONSULTAS
--Datos personales y profesionales del veterinario
SELECT 
    (u.nombre || ' ' || u.apellido_paterno || COALESCE(' ' || u.apellido_materno, ''))::TEXT AS nombre_completo,
    u.email,
    u.telefono,
    u.ciudad,
    e.nombre AS estado_usuario,
    u.fecha_registro,
    dv.cedula_profesional,
    dv.especialidad,
    dv.universidad,
    (SELECT COUNT(*) FROM solicitudes_certificacion sc WHERE sc.id_veterinario = 2 AND sc.id_estado = 4) AS total_certificaciones
FROM usuarios u
JOIN estados e ON u.id_estado = e.id_estado
JOIN datos_veterinarios dv ON u.id_usuario = dv.id_usuario
WHERE u.id_usuario = 2; -- Reemplaza con el ID del usuario que quieras probar

--Solicitudes y panel principal del veterinario
SELECT 
    ('SOL-' || LPAD(sc.id_solicitud::TEXT, 3, '0'))::VARCHAR AS codigo_solicitud,
    a.arete_id,
    cg.nombre AS tipo_ganado,
    (u_prod.nombre || ' ' || u_prod.apellido_paterno)::VARCHAR AS nombre_productor,
    p.nombre AS rancho,
    r.nombre AS raza,
    a.edad AS edad_anios,
    a.peso_kg AS peso_est_kg,
    sc.fecha_solicitud,
    e.nombre AS estado_solicitud
FROM solicitudes_certificacion sc
JOIN animal a ON sc.id_animal = a.id_animal
JOIN productores p ON a.id_productor = p.id_productor
JOIN usuarios u_prod ON p.id_usuario = u_prod.id_usuario
JOIN raza r ON a.id_raza = r.id_raza
JOIN categoria_ganado cg ON r.id_categoria = cg.id_categoria
JOIN estados e ON sc.id_estado = e.id_estado
WHERE sc.id_veterinario = 2 -- Reemplaza con el ID del veterinario
-- AND sc.id_estado = 3     -- Descomenta esta línea si quieres filtrar y ver SOLO las pendientes
ORDER BY sc.fecha_solicitud DESC;

--Bitacora personal del veterinario
SELECT 
    b.fecha_cambio AS fecha_hora,
    ac.nombre AS tipo_accion,
    b.tabla_afectada AS entidad_afectada,
    ('ID Modificado: ' || COALESCE(b.valor_nuevo, b.valor_anterior))::TEXT AS detalles
FROM bitacora b
JOIN accion ac ON b.id_accion = ac.id_accion
WHERE b.id_usuario = 2 -- Reemplaza con el ID del veterinario
ORDER BY b.fecha_cambio DESC;

--Documentos subidos por el veterinario
SELECT 
    td.nombre AS nombre_documento,
    d.url_archivo,
    e.nombre AS estado_documento
FROM documentos_animal d
JOIN tipo_doc td ON d.id_tipo_doc = td.id_tipo_doc
JOIN estados e ON d.id_estado = e.id_estado
WHERE d.id_usuario_subio = 2 
ORDER BY td.nombre ASC;


--FUNCIONES
-- A. Perfil del veterinario (Devuelve un solo Objeto JSON)
CREATE OR REPLACE FUNCTION fn_obtener_perfil_veterinario(p_id_usuario INT)
RETURNS JSON AS $$
DECLARE
    v_resultado JSON;
BEGIN
    SELECT row_to_json(perfil) INTO v_resultado
    FROM (
        SELECT 
            (u.nombre || ' ' || u.apellido_paterno || COALESCE(' ' || u.apellido_materno, ''))::TEXT AS nombre_completo,
            u.email,
            u.telefono,
            u.ciudad,
            e.nombre AS estado_usuario,
            u.fecha_registro,
            dv.cedula_profesional,
            dv.especialidad,
            dv.universidad,
            (SELECT COUNT(*) FROM solicitudes_certificacion sc WHERE sc.id_veterinario = p_id_usuario AND sc.id_estado = 4) AS total_certificaciones
        FROM usuarios u
        JOIN estados e ON u.id_estado = e.id_estado
        JOIN datos_veterinarios dv ON u.id_usuario = dv.id_usuario
        WHERE u.id_usuario = p_id_usuario
    ) perfil;
    
    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

SELECT fn_obtener_perfil_veterinario(3);

-- B. Solicitudes de certificación (Devuelve un Arreglo JSON)
CREATE OR REPLACE FUNCTION fn_obtener_solicitudes_vet(
    p_id_veterinario INT,
    p_id_estado INT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_resultado JSON;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(sol)), '[]'::json) INTO v_resultado
    FROM (
        SELECT 
            ('SOL-' || LPAD(sc.id_solicitud::TEXT, 3, '0'))::VARCHAR AS codigo_solicitud,
            a.arete_id,
            cg.nombre AS tipo_ganado,
            (u_prod.nombre || ' ' || u_prod.apellido_paterno)::VARCHAR AS nombre_productor,
            p.nombre AS rancho,
            r.nombre AS raza,
            a.edad AS edad_anios,
            a.peso_kg AS peso_est_kg,
            sc.fecha_solicitud,
            e.nombre AS estado_solicitud
        FROM solicitudes_certificacion sc
        JOIN animal a ON sc.id_animal = a.id_animal
        JOIN productores p ON a.id_productor = p.id_productor
        JOIN usuarios u_prod ON p.id_usuario = u_prod.id_usuario
        JOIN raza r ON a.id_raza = r.id_raza
        JOIN categoria_ganado cg ON r.id_categoria = cg.id_categoria
        JOIN estados e ON sc.id_estado = e.id_estado
        WHERE sc.id_veterinario = p_id_veterinario
          AND (p_id_estado IS NULL OR sc.id_estado = p_id_estado)
        ORDER BY sc.fecha_solicitud DESC
    ) sol;
    
    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

SELECT fn_obtener_solicitudes_vet(2);
-- C. Actividad del veterinario en la bitácora (Devuelve un Arreglo JSON)
CREATE OR REPLACE FUNCTION fn_obtener_actividad_vet(p_id_usuario INT)
RETURNS JSON AS $$
DECLARE
    v_resultado JSON;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(act)), '[]'::json) INTO v_resultado
    FROM (
        SELECT 
            b.fecha_cambio AS fecha_hora,
            ac.nombre AS tipo_accion,
            b.tabla_afectada AS entidad_afectada,
            ('ID Modificado: ' || COALESCE(b.valor_nuevo, b.valor_anterior))::TEXT AS detalles
        FROM bitacora b
        JOIN accion ac ON b.id_accion = ac.id_accion
        WHERE b.id_usuario = p_id_usuario
        ORDER BY b.fecha_cambio DESC
    ) act;
    
    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

SELECT fn_obtener_actividad_vet(3);

-- D. Documentos subidos por el veterinario (Devuelve un Arreglo JSON)
CREATE OR REPLACE FUNCTION fn_obtener_documentos_vet(p_id_usuario INT)
RETURNS JSON AS $$
DECLARE
    v_resultado JSON;
BEGIN
    SELECT COALESCE(json_agg(row_to_json(doc)), '[]'::json) INTO v_resultado
    FROM (
        SELECT 
            td.nombre AS nombre_documento,
            d.url_archivo,
            e.nombre AS estado_documento
        FROM documentos_animal d
        JOIN tipo_doc td ON d.id_tipo_doc = td.id_tipo_doc
        JOIN estados e ON d.id_estado = e.id_estado
        WHERE d.id_usuario_subio = p_id_usuario
        ORDER BY td.nombre ASC
    ) doc;
    
    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;

SELECT fn_obtener_documentos_vet(2);

-- Funcion para agregar un nuevo veterinario
CREATE OR REPLACE FUNCTION fn_registrar_veterinario(
    p_nombre VARCHAR,
    p_apellido_paterno VARCHAR,
    p_apellido_materno VARCHAR,
    p_email VARCHAR,
    p_telefono VARCHAR,
    p_ciudad VARCHAR,
    p_usuario VARCHAR,
    p_password VARCHAR,
    p_cedula_profesional VARCHAR,
    p_especialidad VARCHAR,
    p_universidad VARCHAR
)
RETURNS JSON AS $$
DECLARE
    v_id_usuario INT;
    v_resultado JSON;
BEGIN
    -- 1. Insertar en usuarios (Rol 4 = Veterinario, Estado 1 = Activo)
    INSERT INTO usuarios (
        id_rol, id_estado, nombre, apellido_paterno, apellido_materno, 
        email, telefono, ciudad, usuario, password, fecha_registro
    ) VALUES (
        4, 1, p_nombre, p_apellido_paterno, p_apellido_materno, 
        p_email, p_telefono, p_ciudad, p_usuario, p_password, NOW()
    ) RETURNING id_usuario INTO v_id_usuario;

    -- 2. Insertar perfil médico
    INSERT INTO datos_veterinarios (
        id_usuario, cedula_profesional, especialidad, universidad
    ) VALUES (
        v_id_usuario, p_cedula_profesional, p_especialidad, p_universidad
    );

    -- 3. Retornar confirmación
    SELECT json_build_object(
        'status', 'success',
        'mensaje', 'Veterinario registrado correctamente',
        'id_usuario', v_id_usuario
    ) INTO v_resultado;

    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;
SELECT fn_registrar_veterinario(
    'Carlos',                     -- p_nombre
    'Ramírez',                    -- p_apellido_paterno
    'López',                      -- p_apellido_materno
    'carlos.vet@email.com',       -- p_email
    '6641122334',                 -- p_telefono
    'Tijuana',                    -- p_ciudad
    'carlos.vet',                 -- p_usuario
    'secreta123',                 -- p_password
    'BC-998877',                  -- p_cedula_profesional
    'Cirugía de Grandes Especies',-- p_especialidad
    'UABC'                        -- p_universidad
);

-- Función para que el veterinario pueda aprobar o negar una solicitud de certificación
CREATE OR REPLACE FUNCTION fn_registrar_revision_veterinaria(
    p_id_solicitud INT,
    p_peso_validado DOUBLE PRECISION,
    p_caracteristicas_validadas TEXT,
    p_observaciones_medicas TEXT,
    p_dictamen VARCHAR,
    p_id_estado_nuevo INT
)
RETURNS JSON AS $$
DECLARE
    v_id_certificacion INT;
    v_id_animal INT;
    v_resultado JSON;
BEGIN
    -- 1. Verificar que la solicitud existe y obtener el id_animal
    SELECT id_animal INTO v_id_animal 
    FROM solicitudes_certificacion 
    WHERE id_solicitud = p_id_solicitud;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La solicitud % no existe.', p_id_solicitud;
    END IF;

    -- 2. Insertar el dictamen en la tabla certificaciones
    INSERT INTO certificaciones (
        id_solicitud, 
        peso_validado, 
        caracteristicas_validades, -- Ajustado al nombre exacto de tu columna
        observaciones_medicas, 
        dictamen, 
        fecha_certificacion
    ) VALUES (
        p_id_solicitud, 
        p_peso_validado, 
        p_caracteristicas_validadas, 
        p_observaciones_medicas, 
        p_dictamen, 
        NOW()
    ) RETURNING id_certificacion INTO v_id_certificacion;

    -- 3. Actualizar el estado Y LAS FECHAS de la solicitud original
    UPDATE solicitudes_certificacion
    SET id_estado = p_id_estado_nuevo,
        fecha_revision = NOW(),
        fecha_dictamen = NOW()
    WHERE id_solicitud = p_id_solicitud;

    -- 4. Actualizar el peso real si se aprueba
    IF p_id_estado_nuevo = 4 THEN
        UPDATE animal 
        SET peso_kg = p_peso_validado 
        WHERE id_animal = v_id_animal;
    END IF;

    -- 5. Retornar confirmación
    SELECT json_build_object(
        'status', 'success',
        'mensaje', 'Certificación registrada y solicitud actualizada correctamente',
        'id_certificacion', v_id_certificacion,
        'id_solicitud', p_id_solicitud
    ) INTO v_resultado;

    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;
SELECT fn_registrar_revision_veterinaria(
    2,
    345.0,                                       -- Peso validado actualizado
    'Animal alerta, mucosas rosadas y pelaje brillante. Condición corporal buena.', 
    'Se verifica tratamiento exitoso de desparasitación reciente. El animal está 100% sano y apto.', 
    'APROBADO',                                  
    4                                            -- 4 = Aprobado
);
SELECT fn_registrar_revision_veterinaria(
    3,
    680.0,                                       -- Peso validado
    'Complexión robusta y buena musculatura.', 
    'Presenta leve callosidad por tratamiento previo de pedero, pero está recuperado y no afecta su movilidad. Apto.', 
    'APROBADO',                                  
    4                                            -- 4 = Aprobado
);
SELECT fn_registrar_revision_veterinaria(
    4,
    420.0,                                       -- Peso validado (bajo peso)
    'Se observa decaimiento, fiebre leve y secreción nasal anormal.', 
    'Se aísla al animal por sospecha de cuadro respiratorio agudo. Se requieren pruebas de laboratorio antes de cualquier movilización.', 
    'RECHAZADO',                                 
    5                                            -- 5 = Rechazado
);

-- Funcion para editar los datos del veterinario
CREATE OR REPLACE FUNCTION fn_actualizar_perfil_veterinario(
    p_id_usuario INT,
    p_nombre VARCHAR,
    p_apellido_paterno VARCHAR,
    p_apellido_materno VARCHAR,
    p_email VARCHAR,
    p_telefono VARCHAR,
    p_ciudad VARCHAR,
    p_especialidad VARCHAR
)
RETURNS JSON AS $$
DECLARE
    v_resultado JSON;
BEGIN
    -- 1. Verificar que el usuario exista
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = p_id_usuario) THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_id_usuario;
    END IF;
    UPDATE usuarios
    SET nombre = p_nombre,
        apellido_paterno = p_apellido_paterno,
        apellido_materno = p_apellido_materno,
        email = p_email,
        telefono = p_telefono,
        ciudad = p_ciudad 
    WHERE id_usuario = p_id_usuario;

    UPDATE datos_veterinarios
    SET especialidad = p_especialidad
    WHERE id_usuario = p_id_usuario;

    -- 4. Retornar confirmación
    SELECT json_build_object(
        'status', 'success',
        'mensaje', 'Perfil de veterinario actualizado correctamente',
        'id_usuario', p_id_usuario
    ) INTO v_resultado;

    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;
SELECT fn_actualizar_perfil_veterinario(
    13,                                       -- El ID del veterinario que quieras actualizar
    'Alberto',                               -- Nombre
    'Méndez',                                -- Apellido Paterno
    'Ruiz',                                  -- Apellido Materno
    'alberto.mendez@email.com',              -- Correo
    '5554567890',                            -- Teléfono
    'Tijuana',                               -- Ciudad
    'Medicina Veterinaria y Zootecnia'       -- Especialidad
);