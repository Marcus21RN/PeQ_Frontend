import api from '../../services/api';

/**
 * Obtiene los documentos subidos por el productor autenticado.
 */
export async function getDocumentosProductor() {
  const resp = await api.get('/traspatio/documentos-productor/');
  return resp.data;
}

export default getDocumentosProductor;