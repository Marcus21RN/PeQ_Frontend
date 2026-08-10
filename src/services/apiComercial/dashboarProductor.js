import api from '../api';

/**
 * Obtiene las estadísticas del panel/dashboard del productor autenticado.
 */
export async function getDashboardComercial() {
  const resp = await api.get('/comercial/dashboard/');
  return resp.data;
}

export default getDashboardComercial;