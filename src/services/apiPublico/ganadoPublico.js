import api from '../api.js';

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const getArrayData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export const getCategoriasGanado = async () => {
  const response = await api.get('/catalogo-publico/estadisticas-certificacion/');
  const rows = getArrayData(response.data);

  return rows.map((item) => ({
    id: item?.id_categoria ?? item?.id ?? 0,
    nombre: item?.nombre_categoria ?? item?.nombre ?? 'Sin categoría',
    descripcion: 'Animales certificados',
    total: toNumber(item?.total_animales_certificados ?? item?.total ?? 0),
  }));
};

export const getAnimalesPorCategoria = async (categoria) => {
  const categorias = await getCategoriasGanado();

  const categoriaSeleccionada =
    typeof categoria === 'object'
      ? categoria
      : categorias.find((item) => String(item.nombre).toLowerCase() === String(categoria ?? '').toLowerCase());

  const categoriaId = categoriaSeleccionada?.id ?? categoria?.id_categoria ?? categoria;

  if (categoriaId === undefined || categoriaId === null || categoriaId === '') {
    return [];
  }

  const response = await api.get('/catalogo-publico/animales-certificados/', {
    params: {
      id_categoria: categoriaId,
      id_estado: 4,
    },
  });

  const rows = getArrayData(response.data);

  return rows.map((animal) => {
    const base = animal?.datos_base ?? animal;
    const nombreRancho = base?.nombre_rancho ?? base?.rancho ?? animal?.nombre_rancho ?? animal?.rancho ?? 'Sin rancho';
    const propietario = base?.propietario ?? animal?.propietario ?? animal?.nombre_propietario ?? nombreRancho;
    const ubicacion = base?.ubicacion_origen ?? animal?.ubicacion_origen ?? animal?.ubicacion ?? 'Sin ubicación registrada';
    const tipoRancho = base?.tipo_rancho ?? animal?.tipo_rancho ?? animal?.tipoRancho ?? 'Sin tipo';
    const certificadoPor = base?.certificado_por ?? animal?.certificado_por ?? animal?.certificadoPor ?? 'Sin información';
    const noIdentificacion = base?.no_identificacion ?? animal?.no_identificacion ?? animal?.arete_id ?? animal?.id_animal ?? 'Sin identificación';

    return {
      id: noIdentificacion,
      nombre: noIdentificacion,
      arete: noIdentificacion,
      categoria: categoriaSeleccionada?.nombre ?? base?.categoria ?? animal?.categoria ?? animal?.nombre_categoria ?? 'Sin categoría',
      raza: base?.raza_animal ?? base?.raza ?? animal?.raza_animal ?? animal?.raza ?? 'Sin raza',
      sexo: base?.sexo ?? animal?.sexo ?? animal?.genero ?? 'Sin sexo',
      edad: base?.edad_anios ?? base?.edad ?? animal?.edad_anios ?? animal?.edad ?? 0,
      peso: base?.peso_kg ?? base?.peso ?? animal?.peso_kg ?? animal?.peso ?? 0,
      estado: base?.condicion_general ?? base?.condicion ?? animal?.condicion ?? animal?.estado ?? 'Sin estado',
      proposito_produccion: base?.proposito_produccion ?? animal?.proposito_produccion ?? animal?.proposito ?? 'Sin propósito',
      precio: base?.precio_venta ?? base?.precio ?? animal?.precio_venta ?? animal?.precio ?? 0,
      productor: nombreRancho,
      nombre_rancho: nombreRancho,
      propietario,
      ubicacion_origen: ubicacion,
      contacto_propietario: base?.contacto_propietario ?? animal?.contacto_propietario ?? animal?.telefono ?? 'Sin contacto registrado',
      certificadoPor,
      foto: animal?.foto_url ?? animal?.foto ?? null,
      tipoRancho: tipoRancho,
      tipo_rancho: tipoRancho,
      condicion: base?.condicion_general ?? base?.condicion ?? 'Sin condición',
      no_identificacion: noIdentificacion,
    };
  });
};

export const getFichaTecnicaPorAnimal = async (areteId) => {
  const identifier = String(areteId ?? '').trim();

  if (!identifier) {
    return {
      datos_base: null,
      historial_medico: [],
    };
  }

  const response = await api.get('/catalogo-publico/ficha-tecnica/', {
    params: {
      arete_id: identifier,
    },
  });

  const payload = response.data ?? {};
  const datosBase = payload?.datos_base ?? payload?.datosBase ?? null;
  const historialMedico = Array.isArray(payload?.historial_medico)
    ? payload.historial_medico
    : Array.isArray(payload?.historialMedico)
      ? payload.historialMedico
      : [];

  return {
    datos_base: datosBase,
    historial_medico: historialMedico,
  };
};

export default {
  getCategoriasGanado,
  getAnimalesPorCategoria,
  getFichaTecnicaPorAnimal,
};
