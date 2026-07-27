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
import ComercialActividades from './pages/comercial/comerActividades.jsx';
import ComercialPerfil from './pages/comercial/comerPerfil.jsx';


import VeterinarioDashboard from './pages/veterinario/vetDashboard.jsx'
import VeterinarioSolicitudes from './pages/veterinario/vetSolicitudes.jsx'
import VeterinarioActividades from './pages/veterinario/vetActividades.jsx'
import VeterinarioPerfil from './pages/veterinario/vetPerfil.jsx'

// Vistas temporales de prueba
const Unauthorized = () => <h1 className="text-2xl font-bold text-red-600">No tienes permiso para ver esta pantalla</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

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
          <Route path="/login" element={<Login />} />

          <Route path="/comercial/inicio" element={<ComercialInicio />} />
          <Route path="/comercial/animales" element={<ComercialAnimales />} />
          <Route path="/comercial/actividades" element={<ComercialActividades />} />
          <Route path="/comercial/perfil" element={<ComercialPerfil />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/solicitudes" element={<AdminSolicitudes />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/perfil" element={<AdminPerfil />} />


          <Route path="/veterinario/dashboard" element={<VeterinarioDashboard/>}/>
          <Route path="/veterinario/solicitudes" element={<VeterinarioSolicitudes/>}/>
          <Route path="/veterinario/actividades" element={<VeterinarioActividades/>}/>
          <Route path="/veterinario/perfil" element={<VeterinarioPerfil/>}/>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
