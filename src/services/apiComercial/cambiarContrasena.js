import api from '../api';

/**
 * Petición PUT para actualizar la contraseña del usuario autenticado.
 * @param {Object} data - Objeto con { contrasena_actual, contrasena_nueva }
 * @returns {Promise<Object>} Respuesta del backend (mensaje de confirmación de la función SQL)
 */
export async function cambiarContrasenaProductor(data) {
  const response = await api.put('/comercial/perfil/cambiar-contrasena/', {
    contrasena_actual: data.contrasena_actual,
    contrasena_nueva: data.contrasena_nueva,
  });
  return response.data;
}

export default cambiarContrasenaProductor;