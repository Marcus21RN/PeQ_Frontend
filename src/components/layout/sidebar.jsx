import { NavLink } from 'react-router-dom';
import { LogOut, ChevronLeft, User } from 'lucide-react';
import { NAV_ITEMS } from '../../config/navigation';
import { useAuth } from '../../context/authContext.jsx';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  // Filtrar menú según rol
  const itemsPermitidos = NAV_ITEMS.filter((item) =>
    item.roles.includes(user?.rol_nombre)
  );

  // Determinar colores del avatar según rol (basado en Figma)
  const getAvatarBg = (rol) => {
    switch (rol) {
      case 'administrador': return 'bg-[#5A3B2A]'; // Café oscuro
      case 'productor_comercial': return 'bg-[#2E6B2C]'; // Verde oscuro
      case 'productor_traspatio': return 'bg-[#B4E3A6] text-[#2E6B2C]'; // Verde claro
      case 'veterinario': return 'bg-[#B4E3A6] text-[#2E6B2C]'; // Verde claro
      default: return 'bg-gray-500';
    }
  };

  // Obtener etiqueta de rol para mostrar
  const getRolLabel = (rol) => {
    switch (rol) {
      case 'administrador': return 'Administrador';
      case 'veterinario': return 'Veterinario Certificador';
      case 'productor_comercial': return 'Rancho Comercial';
      case 'productor_traspatio': return 'Productor de Traspatio';
      default: return 'Usuario';
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen font-serif relative">
      
      {/* Botón colapsar (visual por ahora) */}
      <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        <ChevronLeft className="w-5 h-5 border border-gray-300 rounded" />
      </button>

      {/* Sección de Perfil */}
      <div className="pt-12 pb-6 px-6 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getAvatarBg(user?.rol_nombre)}`}>
          <User className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm">
            {user?.nombre} {user?.apellido_paterno}
          </span>
          <span className="text-xs text-gray-500">
            {getRolLabel(user?.rol_nombre)}
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {itemsPermitidos.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EFEBE4] text-[#3D4C41]' // Fondo beige claro de Figma
                    : 'text-[#4A5568] hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Botón Cerrar Sesión fijo abajo */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
