import api from '../api';

/**
 * Obtiene las estadísticas del panel/dashboard del productor autenticado.
 */
export async function getDashboardProductor() {
  const resp = await api.get('/traspatio/dashboard/');
  return resp.data;
}

export default getDashboardProductor;