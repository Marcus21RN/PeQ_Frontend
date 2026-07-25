import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import AdminPerfil from './admin/adminPerfil.jsx';
import VeterinarioPerfil from './veterinario/vetPerfil.jsx';

export default function PerfilRouter() {
	const { user } = useAuth();

	if (user?.rol_nombre === 'admin') return <AdminPerfil />;
	if (user?.rol_nombre === 'veterinario') return <VeterinarioPerfil />;

	return <Navigate to="/dashboard" replace />;
}