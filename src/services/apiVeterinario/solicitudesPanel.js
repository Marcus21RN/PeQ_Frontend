import api from '../api.js'; // Importamos tu instancia de Axios con el interceptor

export const ESTADOS_REVISION_CERTIFICACION = {
  APROBADA: 4,
  RECHAZADA: 5,
};

const toSolicitudArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

export const normalizarSolicitudVeterinaria = (solicitud = {}) => ({
  id_solicitud: solicitud.id_solicitud ?? solicitud.id ?? null,
  codigo_solicitud: solicitud.codigo_solicitud ?? solicitud.codigo ?? '',
  arete_animal: solicitud.arete_animal ?? solicitud.arete_id ?? solicitud.arete ?? '',
  tipo_ganado: solicitud.tipo_ganado ?? solicitud.tipo ?? '',
  nombre_productor: solicitud.nombre_productor ?? solicitud.productor ?? '',
  rancho: solicitud.rancho ?? '',
  raza: solicitud.raza ?? '',
  edad_anios: solicitud.edad_anios ?? solicitud.edad ?? '',
  peso_est_kg: solicitud.peso_est_kg ?? solicitud.peso ?? '',
  fecha_solicitud: solicitud.fecha_solicitud ?? solicitud.fecha ?? null,
  estado_solicitud: solicitud.estado_solicitud ?? solicitud.estado ?? '',
  sexo: solicitud.sexo ?? 'Sin dato',
  condicion_corporal: solicitud.condicion_corporal ?? 'Excelente',
  tiene_crias: solicitud.tiene_crias ?? false,
  vacunaciones: Array.isArray(solicitud.vacunaciones) ? solicitud.vacunaciones : [],
});

export const normalizarListaSolicitudesVeterinarias = (response) => toSolicitudArray(response).map(normalizarSolicitudVeterinaria);


// Obtiene todas las solicitudes con estado "Pendiente" o "En revisión"

export const getSolicitudesPendientes = async () => {
  const response = await api.get('/solicitudes-panel/', {
    params: { id_estado: 3 } 
  });
  return response.data;
};

export const getTodasLasSolicitudes = async () => {
  const response = await api.get('/solicitudes-panel/');
  return response.data;
}

export const getSolicitudesPorId = async (id_solicitud) => {
  const response = await api.get(`/solicitudes-panel/${id_solicitud}/`);
  return response.data;
};

export const getPerfilDetallado = async (id_usuario) => {
  const response = await api.get('/perfil-detallado/', {
    params: { id_usuario } 
  });
  return response.data;
};

export const getDocumentosSubidos = async (id_usuario) => {
  const response = await api.get('/documentos-subidos-db/', {
    params: { id_usuario }
  });
  return response.data;
};

export const getBitacoraCambios = async () => {
  const response = await api.get('/bitacora-db/');
  return response.data;
};

export const getSolicitudesCambio = async (id_usuario) => {
  const response = await api.get('/solicitudes-cambio/', {
    params: { id_usuario }
  });
  return response.data;
};

export const actualizarPerfilVeterinario = async (payload) => {
  const response = await api.put('/perfil-actualizar-db/', payload);
  return response.data;
};

export const registrarRevisionCertificacion = async (payload) => {
	const response = await api.put('/revision-certificacion-db/', payload);
	return response.data;
};
