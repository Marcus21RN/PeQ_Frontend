import api from '../api.js'; // Importamos tu instancia de Axios con el interceptor


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
