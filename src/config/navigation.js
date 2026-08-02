import { 
  Home, Users, FileText, Activity, User, List, History, FileCheck 
} from 'lucide-react';

/**
 * Mapeo de roles para la navegación
 * id_rol 1 = productor_traspatio
 * id_rol 3 = productor_comercial
 * id_rol 4 = veterinario
 * id_rol 5 = administrador
 */
export const NAV_ITEMS = [
  // --- COMÚN (TODOS LOS ROLES) ---
  {
    title: 'Panel Principal',
    path: '/dashboard',
    icon: Home,
    roles: ['administrador', 'veterinario', 'productor_comercial', 'productor_traspatio']
  },

  // --- ADMINISTRADOR ---
  {
    title: 'Gestión de Usuarios',
    path: '/admin/usuarios',
    icon: Users,
    roles: ['administrador']
  },
  {
    title: 'Solicitudes de Registro',
    path: '/admin/solicitudes',
    icon: FileText,
    roles: ['administrador']
  },
  {
    title: 'Actividades del Sistema',
    path: '/admin/logs',
    icon: Activity,
    roles: ['administrador']
  },

  // --- VETERINARIO ---
  {
    title: 'Revisión de Certificaciones',
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

  // --- PRODUCTOR COMERCIAL ---
  {
    title: 'Mis Animales',
    path: '/comercial/animales',
    icon: List,
    roles: ['productor_comercial']
  },
  {
    title: 'Historial de Acciones',
    path: '/comercial/actividades',
    icon: History,
    roles: ['productor_comercial']
  },

  // --- PRODUCTOR TRASPATIO ---
  {
    title: 'Mis Animales',
    path: '/traspatio/animales',
    icon: List,
    roles: ['productor_traspatio']
  },
  {
    title: 'Historial de Acciones',
    path: '/traspatio/actividades',
    icon: History,
    roles: ['productor_traspatio']
  },

  // --- COMÚN (TODOS LOS ROLES, AL FINAL) ---
  {
    title: 'Mi Perfil',
    path: '/perfil',
    icon: User,
    roles: ['administrador', 'veterinario', 'productor_comercial', 'productor_traspatio']
  },
];
