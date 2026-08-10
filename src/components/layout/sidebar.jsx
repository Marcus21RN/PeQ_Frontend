import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { NAV_ITEMS } from '../../config/navigation';
import { useAuth } from '../../context/authContext.jsx';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <aside className={`relative flex min-h-screen flex-col border-r border-gray-200 bg-white font-serif transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}>
      
      {/* Botón colapsar / expandir */}
      <button
        type="button"
        onClick={() => setIsCollapsed((current) => !current)}
        className="absolute right-4 top-4 rounded border border-gray-300 bg-white p-0.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
        aria-label={isCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Sección de Perfil */}
      <div className={`pb-6 pt-12 ${isCollapsed ? 'px-3' : 'px-6'} flex ${isCollapsed ? 'flex-col items-center gap-3' : 'items-center gap-3'}`}>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${getAvatarBg(user?.rol_nombre)}`}>
          <User className="w-6 h-6" />
        </div>
        <div className={`flex flex-col transition-all duration-200 ${isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
          <span className="font-bold text-gray-900 text-sm">
            {user?.nombre} {user?.apellido_paterno}
          </span>
          <span className="text-xs text-gray-500">
            {getRolLabel(user?.rol_nombre)}
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className={`flex-1 space-y-2 overflow-y-auto ${isCollapsed ? 'px-3' : 'px-4'}`}>
        {itemsPermitidos.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.title : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-lg text-sm font-medium transition-colors ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-2.5'} ${
                  isActive
                    ? 'bg-[#EFEBE4] text-[#3D4C41]' 
                    : 'text-[#4A5568] hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className={`transition-all duration-200 ${isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Botón Cerrar Sesión fijo abajo */}
      <div className={`mt-auto border-t border-gray-100 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        <button
          onClick={logout}
          title={isCollapsed ? 'Cerrar Sesión' : undefined}
          className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 ${isCollapsed ? 'justify-center gap-0' : 'gap-3'}`}
        >
          <LogOut className="w-5 h-5" />
          <span className={`transition-all duration-200 ${isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'opacity-100'}`}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>
  );
};
