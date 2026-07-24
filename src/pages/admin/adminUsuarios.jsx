/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import ModalRevisarUsuario from '../../components/adminComponents/revisarUsuarioModal.jsx';

export default function GestionarUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  
  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [usuarios, setUsuarios] = useState([]);
  // const [stats, setStats] = useState({ todos: 0, activos: 0, cambios: 0, rechazados: 0 });
  // 
  // useEffect(() => {
  //   const fetchUsuarios = async () => {
  //     try {
  //       const res = await api.get('/admin/usuarios');
  //       setUsuarios(res.data.lista);
  //       setStats(res.data.estadisticas);
  //     } catch (error) {
  //       console.error("Error al cargar usuarios:", error);
  //     }
  //   };
  //   fetchUsuarios();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  const mockStats = {
    todos: 11,
    activos: 6,
    cambios: 4,
    rechazados: 1
  };

  const mockUsuarios = [
    { id: 'USR-010', nombre: 'Carlos Alberto Reyes', tipo: 'Administrador', email: 'admin@sistema-ganado.gob.mx', tel: '5559001234', estado: 'Activo', cambios: null },
    { id: 'USR-001', nombre: 'Carlos Mendoza García', tipo: 'Rancho Comercial', email: 'carlos.mendoza@email.com', tel: '5551234567', estado: 'Actualización', cambios: 2 },
    { id: 'USR-007', nombre: 'Dr. Ana López Martínez', tipo: 'Veterinario', email: 'ana.lopez@email.com', tel: '5559876543', estado: 'Activo', cambios: null },
    { id: 'USR-008', nombre: 'Dr. Juan Carlos López', tipo: 'Veterinario', email: 'juancarlos.lopez@email.com', tel: '5557654123', estado: 'Actualización', cambios: 1 },
    { id: 'USR-009', nombre: 'Dra. Sofía Díaz Morales', tipo: 'Veterinario', email: 'sofia.diaz@email.com', tel: '5552901234', estado: 'Activo', cambios: null },
    { id: 'USR-003', nombre: 'Fernando Torres Jiménez', tipo: 'Rancho Comercial', email: 'fernando.torres@email.com', tel: '5557654321', estado: 'Rechazado', cambios: 1 },
    { id: 'USR-011', nombre: 'Laura Hernández García', tipo: 'Administrador', email: 'laura.hernandez@sistema-ganado.gob.mx', tel: '5559012345', estado: 'Actualización', cambios: 2 },
    { id: 'USR-004', nombre: 'Luis García López', tipo: 'Rancho Traspatio', email: 'luis.garcia@email.com', tel: '5556789012', estado: 'Activo', cambios: null },
    { id: 'USR-002', nombre: 'María Rodríguez Castillo', tipo: 'Rancho Comercial', email: 'maria.rodriguez@email.com', tel: '5552876543', estado: 'Activo', cambios: null },
    { id: 'USR-005', nombre: 'Patricia Gómez Herrera', tipo: 'Rancho Traspatio', email: 'patricia.gomez@email.com', tel: '5553456789', estado: 'Actualización', cambios: 1 },
    { id: 'USR-006', nombre: 'Roberto Sánchez Flores', tipo: 'Rancho Traspatio', email: 'roberto.sanchez@email.com', tel: '5555432109', estado: 'Activo', cambios: null },
  ];

  const abrirModal = (id) => {
    setUsuarioSeleccionado(id);
    setIsModalOpen(true);
  };

  // Funciones auxiliares para renderizar badges visuales
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Activo': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Activo</span>;
      case 'Actualización': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Actualización</span>;
      case 'Rechazado': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Rechazado</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-serif">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Usuarios</h1>
        <p className="text-gray-500 mt-2 font-sans">Revisa y gestiona la información de todos los usuarios registrados en el sistema</p>
      </div>

      {/* Tarjetas de Filtro Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
        <div className="bg-[#5A3B2A] text-white p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm font-medium">Todos</span>
          </div>
          <span className="text-3xl font-bold">{mockStats.todos}</span>
        </div>
        
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Activos</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.activos}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-sm font-medium text-gray-600">Con Cambios</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.cambios}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Rechazados</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.rechazados}</span>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex gap-4 font-sans">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none"
            placeholder="Buscar por ID, nombre, email..."
          />
        </div>
        <button className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-gray-600 hover:bg-gray-50 flex items-center justify-center">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Solicitud Cambios</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockUsuarios.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.nombre}</td>
                  <td className="px-6 py-4">{user.tipo}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.tel}</td>
                  <td className="px-6 py-4">{getEstadoBadge(user.estado)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {user.cambios ? (
                        <span className="flex items-center justify-center w-6 h-6 bg-[#FFF4D2] text-[#8B6E00] rounded-full text-xs font-bold">
                          {user.cambios}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => abrirModal(user.id)}
                        className="bg-[#5A3B2A] hover:bg-[#4A2F22] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer de la Tabla */}
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
          Mostrando <span className="font-bold text-gray-900 mx-1">11</span> de <span className="font-bold text-gray-900 mx-1">11</span> usuarios
        </div>
      </div>

      {/* Modal Integrado */}
      <ModalRevisarUsuario 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        usuarioId={usuarioSeleccionado}
      />
      
    </div>
  );
}
