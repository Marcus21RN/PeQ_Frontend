import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest } from '../services/api.js';

/* eslint-disable react-refresh/only-export-components */

const decodeTokenPayload = (token) => {
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split('.');
    if (!payloadBase64) return null;

    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return decoded;
  } catch {
    return null;
  }
};

const AuthContext = createContext();

// CORRECCIÓN: IDs actualizados según la base de datos
const obtenerNombreDeRol = (id_rol) => {
  const roleMap = {
    1: 'productor_traspatio',
    3: 'productor_comercial',
    4: 'veterinario',
    5: 'administrador',
  };
  return roleMap[id_rol] || 'desconocido';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user_info');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginRequest(username, password);
      const accessToken = data.access_token || data.token;

      if (!accessToken) {
        return { success: false, message: 'El backend no devolvió un token de acceso.' };
      }
      
      const payload = decodeTokenPayload(accessToken);
      const userData = data.usuario_info
        ? {
          id_usuario: data.usuario_info.id_usuario,
          usuario: data.usuario_info.usuario,
          nombre: data.usuario_info.nombre,
          apellido_paterno: data.usuario_info.apellido_paterno,
          id_rol: data.usuario_info.id_rol,
          rol_nombre: obtenerNombreDeRol(data.usuario_info.id_rol),
        }
      : {
          id_usuario: payload?.id_usuario ?? null,
          usuario: payload?.sub || payload?.usuario || username,
          nombre: payload?.nombre || payload?.sub || username,
          apellido_paterno: payload?.apellido_paterno || '',
          id_rol: payload?.id_rol ?? payload?.rol_id ?? null,
          rol_nombre: obtenerNombreDeRol(payload?.id_rol ?? payload?.rol_id),
        };

      // Guardar en estado y localStorage
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user_info', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const backendMessage = error.response?.data?.detail || error.response?.data?.message;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      setToken(null);
      setUser(null);
      return { 
        success: false, 
        message: backendMessage || 'Error en las credenciales o en la conexión con el Backend'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
