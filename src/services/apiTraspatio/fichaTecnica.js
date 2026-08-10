import api from '../../services/api';

/**
 * Obtiene la ficha técnica completa del animal por su número de arete/identificación.
 */
export async function getFichaTecnicaAnimal(areteId) {
  const resp = await api.get(`/traspatio/ficha-tecnica/${encodeURIComponent(areteId)}`);
  return resp.data;
}

export default getFichaTecnicaAnimal;