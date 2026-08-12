import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/mainLayout.jsx';
import { ProtectedRoute } from './components/auth/protectedRoute.jsx';
import { useAuth } from './context/authContext.jsx';

import Login from './pages/auth/login.jsx';

// Público
import PublicoCatalogo from './pages/publico/publicoCatalogo.jsx';
import PublicoAnimales from './pages/publico/publicoAnimales.jsx';
import RegistroUsuario from './pages/publico/registroUsuario.jsx';

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
  <div className="min-h-screen bg-[#f3f1ee] text-[#2d1d12]">
    <header className="bg-[#4c2d1d] text-[#f4efe9] shadow-md">
      <div className="max-w-6xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Sistema de Regulación y Control de Ganado
            </h1>
            <p className="mt-1 text-sm md:text-base italic text-[#eae0d8]">
              Verifica, confirma y compra
            </p>
          </div>
        </div>
      </div>
    </header>

    <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-[#d9d2cc] bg-white p-8 text-center shadow-sm md:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e3dd] text-[#8d564f]">
          <span className="text-3xl">!</span>
        </div>
        <h2 className="text-3xl font-bold text-[#2d1d12]">No autorizado</h2>
        <p className="mt-4 text-lg text-[#5b473c]">
          No tienes permiso para acceder a esta página.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/publico"
            className="rounded-xl border border-[#d8d1c9] bg-[#f7f5f3] px-5 py-3 text-sm font-medium text-[#2d1d12] transition hover:bg-[#efeae5]"
          >
            Ir al catálogo público
          </a>
          <a
            href="/login"
            className="rounded-xl bg-[#4c2d1d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#613c2c]"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </main>

    <footer className="bg-[#4c2d1d] text-[#f4efe9] py-6">
      <div className="max-w-6xl mx-auto px-5 text-center">
        <p className="text-sm md:text-base font-medium">
          © 2026 Sistema de Regulación y Control de Ganado · Gobierno Federal
        </p>
        <p className="mt-1 text-xs md:text-sm italic text-[#e9d8ca]">
          Certificación veterinaria oficial · Trazabilidad garantizada
        </p>
      </div>
    </footer>
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
        <Route path="/" element={<Navigate to="/publico" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/publico" element={<PublicoCatalogo />} />
        <Route path="/publico/animales" element={<PublicoAnimales />} />
        <Route path="/registro" element={<RegistroUsuario />} />

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
