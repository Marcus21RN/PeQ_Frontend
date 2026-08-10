import api from '../api.js';

export async function cambiarContrasenaAdministrador(data) {
  const response = await api.put('/admin/perfil/cambiar-contrasena/', {
    contrasena_actual: data.contrasena_actual,
    contrasena_nueva: data.contrasena_nueva,
  });
  return response.data;
}

export default cambiarContrasenaAdministrador;