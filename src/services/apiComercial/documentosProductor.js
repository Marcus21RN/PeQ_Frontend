import api from '../../services/api';

/**
 * Obtiene los documentos subidos por el productor autenticado.
 */
export async function getDocumentosComercial() {
  const resp = await api.get('/comercial/documentos-productor/');
  return resp.data;
}

export default getDocumentosComercial;