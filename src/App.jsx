import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/mainLayout.jsx';

import Login from './pages/auth/login.jsx';

import AdminDashboard from './pages/admin/adminDashboard.jsx';
import AdminUsuarios from './pages/admin/adminUsuarios.jsx';
import AdminSolicitudes from './pages/admin/adminSolicitudes.jsx';
import AdminLogs from './pages/admin/adminLogs.jsx';
import AdminPerfil from './pages/admin/adminPerfil.jsx';

import ComercialInicio from './pages/comercial/comerInicio.jsx';
import ComercialAnimales from './pages/comercial/comerAnimales.jsx';
import ComercialRegAnimal from './pages/comercial/comerRegAnimal.jsx';

// Vistas temporales de prueba
const Dashboard = () => <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>;
const VetCertificaciones = () => <h1 className="text-2xl font-bold">Certificaciones (Veterinario)</h1>;
const Unauthorized = () => <h1 className="text-2xl font-bold text-red-600">No tienes permiso para ver esta pantalla</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas temporales sin protección para desarrollo
        <Route element={<ProtectedRoute allowedRoles={['admin', 'productor', 'veterinario']} />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route element={<ProtectedRoute allowedRoles={['productor', 'admin']} />}>
              <Route path="/productor/animales" element={<ProductorAnimales />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['veterinario', 'admin']} />}>
              <Route path="/veterinario/certificaciones" element={<VetCertificaciones />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        */}

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/comercial/inicio" element={<ComercialInicio />} />
          <Route path="/comercial/animales" element={<ComercialAnimales />} />
          <Route path="/comercial/registrar-animal" element={<ComercialRegAnimal />} />


          <Route path="/veterinario/certificaciones" element={<VetCertificaciones />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/solicitudes" element={<AdminSolicitudes />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/perfil" element={<AdminPerfil />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
