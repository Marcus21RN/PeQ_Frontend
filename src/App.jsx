import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/mainLayout.jsx';
import { ProtectedRoute } from './components/auth/protectedRoute.jsx';
import { useAuth } from './context/authContext.jsx';

import Login from './pages/auth/login.jsx';

// Admin
import AdminDashboard from './pages/admin/dashboard.jsx';
import AdminUsuarios from './pages/admin/adminUsuarios.jsx';
import AdminSolicitudes from './pages/admin/adminSolicitudes.jsx';
import AdminLogs from './pages/admin/adminLogs.jsx';
import AdminPerfil from './pages/admin/adminPerfil.jsx';

// Comercial
import ComercialInicio from './pages/comercial/dashboard.jsx';
import ComercialAnimales from './pages/comercial/comerAnimales.jsx';
import ComercialActividades from './pages/comercial/comerActividades.jsx';
import ComercialPerfil from './pages/comercial/comerPerfil.jsx';

// Traspatio
import TraspatioInicio from './pages/traspatio/dashboard.jsx';
import TraspatioAnimales from './pages/traspatio/trasAnimales.jsx';
import TraspatioActividades from './pages/traspatio/trasActividades.jsx';
import TraspatioPerfil from './pages/traspatio/trasPerfil.jsx';

// Veterinario
import VeterinarioDashboard from './pages/veterinario/dashboard.jsx';
import VeterinarioSolicitudes from './pages/veterinario/vetSolicitudes.jsx';
import VeterinarioActividades from './pages/veterinario/vetActividades.jsx';
import VeterinarioPerfil from './pages/veterinario/vetPerfil.jsx';

// Página de error
const Unauthorized = () => (
  <div className="flex h-screen items-center justify-center bg-red-50">
    <h1 className="text-3xl font-bold text-red-600">No tienes permiso para acceder a esta página</h1>
  </div>
);

// Componente para redireccionar al dashboard correcto según el rol
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const dashboardRoutes = {
    administrador: '/admin/dashboard',
    veterinario: '/veterinario/dashboard',
    productor_comercial: '/comercial/dashboard',
    productor_traspatio: '/traspatio/dashboard'
  };
  
  return <Navigate to={dashboardRoutes[user.rol_nombre] || '/login'} replace />;
};

// Componente para redireccionar al perfil correcto según el rol
const ProfileRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const profileRoutes = {
    administrador: '/admin/perfil',
    veterinario: '/veterinario/perfil',
    productor_comercial: '/comercial/perfil',
    productor_traspatio: '/traspatio/perfil'
  };
  
  return <Navigate to={profileRoutes[user.rol_nombre] || '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute allowedRoles={['administrador', 'veterinario', 'productor_comercial', 'productor_traspatio']} />}>
          <Route element={<MainLayout />}>
            
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/perfil" element={<ProfileRedirect />} />

            <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/solicitudes" element={<AdminSolicitudes />} />
              <Route path="/admin/logs" element={<AdminLogs />} />
              <Route path="/admin/perfil" element={<AdminPerfil />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['veterinario']} />}>
              <Route path="/veterinario/dashboard" element={<VeterinarioDashboard />} />
              <Route path="/veterinario/solicitudes" element={<VeterinarioSolicitudes />} />
              <Route path="/veterinario/actividades" element={<VeterinarioActividades />} />
              <Route path="/veterinario/perfil" element={<VeterinarioPerfil />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['productor_comercial']} />}>
              <Route path="/comercial/dashboard" element={<ComercialInicio />} />
              <Route path="/comercial/animales" element={<ComercialAnimales />} />
              <Route path="/comercial/actividades" element={<ComercialActividades />} />
              <Route path="/comercial/perfil" element={<ComercialPerfil />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['productor_traspatio']} />}>
              <Route path="/traspatio/dashboard" element={<TraspatioInicio />} />
              <Route path="/traspatio/animales" element={<TraspatioAnimales />} />
              <Route path="/traspatio/actividades" element={<TraspatioActividades />} />
              <Route path="/traspatio/perfil" element={<TraspatioPerfil />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
