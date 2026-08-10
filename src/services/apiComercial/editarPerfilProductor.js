import api from '../api';

/**
 * Petición PUT para actualizar el perfil del productor.
 * @param {Object} data - Datos personales y del rancho
 */
export async function editarPerfilProductor(data) {
  const response = await api.put('/comercial/perfil/editar/', data);
  return response.data;
}

export default editarPerfilProductor;