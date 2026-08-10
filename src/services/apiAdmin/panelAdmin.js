import api from '../api.js';

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.lista)) return payload.lista;
  return [];
};

const text = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') return String(value);
  return String(value);
};

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeLabel = (value) =>
  text(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const ESTADO_ALIAS = {
  activo: 'activo',
  inactivo: 'inactivo',
  pendiente: 'pendiente de revision',
  'pendiente de revision': 'pendiente de revision',
  'en revision': 'en revision',
  actualizacion: 'pendiente de revision',
  aprobado: 'aprobado',
  aprobada: 'aprobado',
  rechazado: 'rechazado',
  rechazada: 'rechazado',
  bloqueado: 'bloqueado',
  registrado: 'registrado',
  certificado: 'certificado',
};

const normalizeEstadoLookup = (value) => ESTADO_ALIAS[normalizeLabel(value)] || normalizeLabel(value);

export const normalizeEstadoCatalogo = (item = {}, index = 0) => ({
  id_estado: item.id_estado ?? item.id ?? index,
  nombre: text(item.nombre ?? item.nombre_estado ?? item.estado ?? '', `Estado ${index + 1}`),
});

export const normalizeUsuariosActivos = (item = {}, index = 0) => ({
  id: item.id_rol ?? item.id_tipo_usuario ?? index,
  tipo_usuario: text(item.tipo_usuario ?? item.tipo_rol ?? item.rol ?? item.nombre_rol, `Tipo ${index + 1}`),
  total_usuarios_activos: number(item.total_usuarios_activos ?? item.total ?? item.cantidad ?? item.activos, 0),
});

export const normalizeRolCatalogo = (item = {}, index = 0) => ({
  id_rol: item.id_rol ?? item.id ?? index,
  nombre: text(item.nombre ?? item.nombre_rol ?? item.rol ?? '', `Rol ${index + 1}`),
  descripcion: text(item.descripcion ?? ''),
});

export const normalizeSolicitudRegistro = (item = {}, index = 0) => ({
  id_usuario: item.id_usuario ?? item.id ?? null,
  id_usuario_display: text(item.id_usuario_display ?? item.codigo_usuario ?? item.id_usuario ?? item.id, `USR-${String(index + 1).padStart(3, '0')}`),
  nombre_completo: text(item.nombre_completo ?? item.nombre ?? item.usuario ?? ''),
  tipo_rol: text(item.tipo_rol ?? item.tipo_usuario ?? item.rol_sistema ?? item.rol ?? ''),
  email: text(item.email ?? item.correo ?? ''),
  telefono: text(item.telefono ?? item.tel ?? ''),
  fecha_solicitud: text(item.fecha_solicitud ?? item.fecha ?? ''),
  estado_usuario: text(item.estado_usuario ?? item.estado ?? ''),
  ciudad: text(item.ciudad ?? item.municipio ?? ''),
  raw: item,
});

export const normalizeUsuarioAdmin = (item = {}, index = 0) => ({
  id_usuario: item.id_usuario ?? item.id ?? null,
  id_usuario_display: text(item.id_usuario_display ?? item.codigo_usuario ?? item.id_usuario ?? item.id, `USR-${String(index + 1).padStart(3, '0')}`),
  nombre_completo: text(item.nombre_completo ?? [item.nombre, item.apellido_paterno, item.apellido_materno].filter(Boolean).join(' ') ?? ''),
  tipo_rol: text(item.tipo_rol ?? item.tipo_usuario ?? item.rol_sistema ?? item.rol ?? ''),
  email: text(item.email ?? item.correo ?? ''),
  telefono: text(item.telefono ?? item.tel ?? ''),
  estado_usuario: text(item.estado_usuario ?? item.estado ?? ''),
  solicitudes_cambio: number(item.solicitudes_cambio ?? item.cambios ?? item.total_cambios, 0),
  ciudad: text(item.ciudad ?? item.municipio ?? ''),
  raw: item,
});

export const normalizeBitacoraSistema = (item = {}, index = 0) => ({
  id: item.id_bitacora ?? item.id ?? index,
  fecha_hora: text(item.fecha_hora ?? item.fechaHora ?? item.fecha ?? ''),
  usuario_responsable: text(item.usuario_responsable ?? item.usuario ?? ''),
  tipo_usuario: text(item.tipo_usuario ?? item.tipoUsuario ?? ''),
  accion: text(item.accion ?? ''),
  entidad: text(item.entidad ?? ''),
  detalles: text(item.detalles ?? item.descripcion ?? ''),
  ciudad: text(item.ciudad ?? ''),
  raw: item,
});

export const normalizePerfilAdministrador = (item = {}) => ({
  id_usuario: item.id_usuario ?? item.id ?? null,
  nombre_completo: text(item.nombre_completo ?? item.nombre ?? ''),
  email: text(item.email ?? item.correo ?? ''),
  telefono: text(item.telefono ?? item.tel ?? ''),
  ciudad: text(item.ciudad ?? item.municipio ?? ''),
  rol_sistema: text(item.rol_sistema ?? item.rol ?? ''),
  miembro_desde: text(item.miembro_desde ?? item.fecha_registro ?? ''),
  estatus_cuenta: text(item.estatus_cuenta ?? item.estado_cuenta ?? item.estado ?? ''),
  raw: item,
});

export const normalizeSolicitudCambioPerfil = (item = {}, index = 0) => ({
  id: item.id ?? item.id_solicitud ?? index,
  campo: text(item.campo ?? item.campo_modificado ?? item.campo_cambio ?? '', 'Sin campo'),
  valorAnterior: text(item.valorAnterior ?? item.valor_anterior ?? item.valor_viejo ?? item.anterior ?? ''),
  valorNuevo: text(item.valorNuevo ?? item.valor_nuevo ?? item.valor_nuevo_solicitado ?? item.nuevo ?? ''),
  fecha: text(item.fecha ?? item.fecha_solicitud ?? item.created_at ?? ''),
  estado: text(item.estado ?? item.estado_solicitud ?? item.estado_revision ?? ''),
  motivoRechazo: text(item.motivoRechazo ?? item.motivo_rechazo ?? item.motivo ?? ''),
  raw: item,
});

export const getEstadosCatalogo = async () => {
  const response = await api.get('/admin/estados/');
  return extractArray(response.data).map(normalizeEstadoCatalogo);
};

export const getEstadoIdPorNombre = (estados = [], nombreEstado) => {
  const estadoNormalizado = normalizeEstadoLookup(nombreEstado);
  const coincidencia = estados.find((estado) => normalizeEstadoLookup(estado.nombre) === estadoNormalizado);
  return coincidencia?.id_estado ?? null;
};

export const getEstadoNombrePorId = (estados = [], idEstado) => {
  const coincidencia = estados.find((estado) => String(estado.id_estado) === String(idEstado));
  return coincidencia?.nombre ?? '';
};

export const getEstadoCatalogoItem = (estados = [], value) => {
  if (value === null || value === undefined || value === '') return null;

  const byId = estados.find((estado) => String(estado.id_estado) === String(value));
  if (byId) return byId;

  const normalizedValue = normalizeEstadoLookup(value);
  const byName = estados.find((estado) => normalizeEstadoLookup(estado.nombre) === normalizedValue);
  return byName ?? null;
};

export const getEstadoIdPorValor = (estados = [], value) => getEstadoCatalogoItem(estados, value)?.id_estado ?? null;

export const getEstadoNombrePorValor = (estados = [], value) => getEstadoCatalogoItem(estados, value)?.nombre ?? text(value, '');

export const getUsuariosActivos = async () => {
  const response = await api.get('/usuarios-activos/');
  return extractArray(response.data).map(normalizeUsuariosActivos);
};

export const getRolesCatalogo = async () => {
  const response = await api.get('/roles/');
  return extractArray(response.data).map(normalizeRolCatalogo);
};

export const getSolicitudesRegistro = async (params = {}) => {
  const response = await api.get('/solicitudes-registro/', { params });
  return extractArray(response.data).map(normalizeSolicitudRegistro);
};

export const getUsuariosAdministracion = async (params = {}) => {
  const response = await api.get('/admin/usuarios/', { params });
  return extractArray(response.data).map(normalizeUsuarioAdmin);
};

export const getBitacoraSistema = async (params = {}) => {
  const response = await api.get('/bitacora-sistema/', { params });
  return extractArray(response.data).map(normalizeBitacoraSistema);
};

export const getPerfilAdministrador = async () => {
  const response = await api.get('/perfil-administrador/');
  return normalizePerfilAdministrador(response.data);
};

export const getSolicitudesCambioAdministrador = async (params = {}) => {
  const response = await api.get('/solicitudes-cambio/', { params });
  return extractArray(response.data).map(normalizeSolicitudCambioPerfil);
};

export const actualizarUsuarioAdministrador = async (id_usuario, payload = {}) => {
  const response = await api.put(`/admin/usuarios/${id_usuario}`, payload);
  return response.data;
};
