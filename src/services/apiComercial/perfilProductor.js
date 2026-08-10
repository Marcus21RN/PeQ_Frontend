import api from '../api';

/**
 * Consulta la información del perfil del productor comercial
 */
export async function getPerfilProductor() {
  const response = await api.get('/comercial/perfil/');
  return response.data;
}

/**
 * Consulta los documentos subidos por el productor comercial
 */
export async function getDocumentosProductor() {
  const response = await api.get('/comercial/documentos/');
  return response.data;
}

export default { getPerfilProductor, getDocumentosProductor };