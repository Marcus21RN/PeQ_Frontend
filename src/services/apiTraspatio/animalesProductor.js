import api from '../../services/api';

export async function getAnimalesProductor({ skip = 0, limit = 50 } = {}) {
  const params = {};
  if (skip !== undefined) params.skip = skip;
  if (limit !== undefined) params.limit = limit;

  const resp = await api.get('/traspatio/animales-productor/', { params });
  return resp.data;
}

export default getAnimalesProductor;
