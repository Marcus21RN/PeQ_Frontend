import api from '../api';

/**
 * Consulta el historial de bitácora y acciones del productor comercial.
 */
export async function getActividadesProductor() {
  const response = await api.get('/comercial/actividades/');
  return response.data;
}

export default getActividadesProductor;