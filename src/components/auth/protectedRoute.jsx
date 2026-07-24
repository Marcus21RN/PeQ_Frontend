import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext.jsx';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando aplicación...</p>
      </div>
    ); 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ahora validamos contra el rol traducido a texto (ej. 'admin', 'productor', 'veterinario')
  if (allowedRoles && !allowedRoles.includes(user?.rol_nombre)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
