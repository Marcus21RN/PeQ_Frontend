import api from '../../services/api';
/**
 * Obtiene la información del perfil del productor autenticado.
 */
export async function getPerfilProductor() {
  const resp = await api.get('/traspatio/perfil/');
  return resp.data;
}

export default getPerfilProductor;