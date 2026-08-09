import api from '../api.js'; // Importamos tu instancia de Axios con el interceptor


// Obtiene todas las solicitudes con estado "Pendiente" o "En revisión"

export const getSolicitudesPendientes = async () => {
  const response = await api.get('/solicitudes-panel/', {
    params: { id_estado: 3 } 
  });
  return response.data;
};


 // Obtiene toda la información de una solicitud específica para llenar el Modal
export const getSolicitudById = async (id_solicitud) => {
  const response = await api.get(`/solicitudes/${id_solicitud}`);
  return response.data;
};

/**
 * Envía la evaluación final del Veterinario (Aprobar o Rechazar)
 * @param {number} id_solicitud - El ID de la solicitud evaluada
 * @param {object} evaluacionData - Toda la información recolectada en el modal
 */

export const evaluarSolicitud = async (id_solicitud, evaluacionData) => {
  /* 
    evaluacionData debería tener una estructura similar a esta:
    {
      id_nuevo_estado: 2, // ej: 2 = Aprobado, 3 = Rechazado
      peso_validado: 450,
      condicion_corporal: "Excelente",
      tiene_crias: false,
      observaciones_tecnicas: "El animal se encuentra en perfectas condiciones...",
      vacunaciones: [
        { nombre: "Fiebre Aftosa", lote: "LOT-2025-001", fecha: "2026-01-14" }
      ]
    }
  */
  const response = await api.put(`/solicitudes/${id_solicitud}/evaluar`, evaluacionData);
  return response.data;
};
