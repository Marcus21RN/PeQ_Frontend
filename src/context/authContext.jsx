import { createContext, useContext, useState, useEffect } from 'react';
import { loginRequest } from '../services/api.js';

/* eslint-disable react-refresh/only-export-components */

const AuthContext = createContext();

// Función auxiliar para traducir el id_rol a un nombre en texto
const obtenerNombreDeRol = (id_rol) => {
  if ([1, 3].includes(id_rol)) return 'productor'; // Asignado a id_rol 1 y 3
  if ([2, 4].includes(id_rol)) return 'veterinario'; // Asignado a id_rol 2 y 4
  if (id_rol === 5) return 'admin'; // Asignado a id_rol 5
  return 'desconocido';
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
      // loginRequest ya envía data como application/x-www-form-urlencoded con username y password
      const data = await loginRequest(username, password);
      
      const accessToken = data.access_token;
      
      // Mapeamos los datos exactos que devuelve tu API
      const userData = {
        id_usuario: data.usuario_info.id_usuario,
        usuario: data.usuario_info.usuario,
        nombre: data.usuario_info.nombre,
        apellido_paterno: data.usuario_info.apellido_paterno,
        id_rol: data.usuario_info.id_rol,
        rol_nombre: obtenerNombreDeRol(data.usuario_info.id_rol) // Propiedad calculada para el frontend
      };

      setToken(accessToken);
      setUser(userData);

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user_info', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { 
        success: false, 
        message: 'Error en las credenciales' 
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
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};
