import api from '../../services/api';

/**
 * Obtiene la actividad (bitácora) del productor autenticado.
 * Parametros opcionales: skip, limit
 */
export async function getActividadProductor({ skip = 0, limit = 100 } = {}) {
  const params = {};
  if (skip !== undefined) params.skip = skip;
  if (limit !== undefined) params.limit = limit;

  const resp = await api.get('/traspatio/actividades/', { params });
  return resp.data;
}

export default getActividadProductor;