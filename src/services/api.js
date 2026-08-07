import axios from 'axios';

// Obtiene la URL desplegada en Render o usa localhost como fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'https://peq-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición: Adjunta el token Bearer en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejo global de errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.warn('Sesión expirada o token inválido.');
          localStorage.removeItem('access_token'); // Limpiamos tu token específico
          // Redirección forzada al login para limpiar estado de la app
          window.location.href = '/login'; 
          break;
        case 403:
          console.warn('Acceso denegado (403). No tienes permisos.');
          break;
        case 404:
          console.warn('El recurso solicitado no fue encontrado.');
          break;
        case 422:
          console.warn('Error de validación (FastAPI):', data.detail);
          break;
        case 500:
          console.error('Error interno del servidor.');
          break;
        default:
          console.error(`Ocurrió un error inesperado: Código ${status}`);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('No se pudo conectar con el servidor.');
    } else {
      // Error al configurar la petición en Axios
      console.error('Error de configuración:', error.message);
    }

    // Rechazamos la promesa para que las pantallas aún puedan capturar el error si lo necesitan
    return Promise.reject(error);
  }
);

// Petición especial para el login de FastAPI (OAuth2PasswordRequestForm exige Form Data)
export const loginRequest = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export default api;
