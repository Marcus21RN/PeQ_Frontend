import { 
  Home, Users, FileText, Activity, Shield, User, 
  PlusCircle, List, Edit, History, FileCheck 
} from 'lucide-react';

export const NAV_ITEMS = [
  // --- COMÚN ---
  {
    title: 'Panel Principal',
    path: '/dashboard',
    icon: Home,
    roles: ['admin', 'veterinario', 'productor', 'traspatio']
  },

  // --- ADMINISTRADOR ---
  {
    title: 'Gestión de Usuarios',
    path: '/admin/usuarios',
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'Solicitudes de Registro',
    path: '/admin/solicitudes',
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'Actividad del Sistema',
    path: '/admin/actividad-sistema',
    icon: Activity,
    roles: ['admin']
  },
  {
    title: 'Actividad Admins',
    path: '/admin/actividad-admins',
    icon: Shield,
    roles: ['admin']
  },

  // --- VETERINARIO ---
  {
    title: 'Todas las Solicitudes',
    path: '/veterinario/solicitudes',
    icon: FileCheck,
    roles: ['veterinario']
  },
  {
    title: 'Mis Actividades',
    path: '/veterinario/actividades',
    icon: Activity,
    roles: ['veterinario']
  },

  // --- PRODUCTOR / TRASPATIO ---
  {
    title: 'Registrar Animal',
    path: '/ganado/registrar',
    icon: PlusCircle,
    roles: ['productor', 'traspatio']
  },
  {
    title: 'Mis Animales',
    path: '/ganado/lista',
    icon: List,
    roles: ['productor', 'traspatio']
  },
  {
    title: 'Modificar Animales',
    path: '/ganado/modificar',
    icon: Edit,
    roles: ['productor'] // <-- Función Premium: Traspatio no la ve
  },
  {
    title: 'Historial de Acciones',
    path: '/ganado/historial',
    icon: History,
    roles: ['productor', 'traspatio']
  },

  // --- COMÚN (AL FINAL) ---
  {
    title: 'Mi Perfil',
    path: '/perfil',
    icon: User,
    roles: ['admin', 'veterinario', 'productor', 'traspatio']
  },
];
