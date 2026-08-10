import { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import ModalRevisarUsuario from '../../components/adminComponents/revisarUsuarioModal.jsx';
import { getEstadoIdPorNombre, getEstadosCatalogo, getUsuariosAdministracion } from '../../services/apiAdmin/panelAdmin.js';

export default function GestionarUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [estadosCatalogo, setEstadosCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');

  useEffect(() => {
    let isMounted = true;

    const cargarUsuarios = async () => {
      try {
        const [data, estados] = await Promise.all([
          getUsuariosAdministracion(),
          getEstadosCatalogo().catch(() => []),
        ]);
        if (!isMounted) return;
        setUsuarios(data);
        setEstadosCatalogo(estados);
        setError(null);
      } catch (requestError) {
        console.error('Error al cargar usuarios admin:', requestError);
        if (isMounted) {
          setError('No se pudo cargar la lista de usuarios.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarUsuarios();

    return () => {
      isMounted = false;
    };
  }, []);

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setIsModalOpen(true);
  };

  const estadoActivoId = getEstadoIdPorNombre(estadosCatalogo, 'Activo');
  const estadoPendienteId = getEstadoIdPorNombre(estadosCatalogo, 'Pendiente de Revisión');
  const estadoEnRevisionId = getEstadoIdPorNombre(estadosCatalogo, 'En Revisión');
  const estadoRechazadoId = getEstadoIdPorNombre(estadosCatalogo, 'Rechazado');

  const getEstadoIdUsuario = (estado) => getEstadoIdPorNombre(estadosCatalogo, estado);

  // Funciones auxiliares para renderizar badges visuales
  const getEstadoBadge = (estado) => {
    const estadoId = getEstadoIdUsuario(estado);

    if (estadoId === estadoActivoId) {
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Activo</span>;
    }

    if (estadoId === estadoPendienteId || estadoId === estadoEnRevisionId) {
      return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Pendiente de revisión</span>;
    }

    if (estadoId === estadoRechazadoId) {
      return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Rechazado</span>;
    }

    return estado ? <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{estado}</span> : null;
  };

  const estadoOpciones = [
    { value: 'todos', label: 'Todos' },
    ...estadosCatalogo,
  ];

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const search = searchTerm.trim().toLowerCase();
    const coincideBusqueda = !search || [
      usuario.id_usuario_display,
      usuario.nombre_completo,
      usuario.tipo_rol,
      usuario.email,
      usuario.telefono,
      usuario.estado_usuario,
      usuario.ciudad,
    ].some((value) => (value || '').toLowerCase().includes(search));

    if (!coincideBusqueda) {
      return false;
    }

    if (estadoFiltro === 'todos') {
      return true;
    }

    return String(getEstadoIdUsuario(usuario.estado_usuario)) === String(estadoFiltro);
  });

  const stats = {
    todos: usuarios.length,
    activos: usuarios.filter((usuario) => String(getEstadoIdUsuario(usuario.estado_usuario)) === String(estadoActivoId)).length,
    cambios: usuarios.filter((usuario) => {
      const estadoId = getEstadoIdUsuario(usuario.estado_usuario);
      return String(estadoId) === String(estadoPendienteId) || String(estadoId) === String(estadoEnRevisionId);
    }).length,
    rechazados: usuarios.filter((usuario) => String(getEstadoIdUsuario(usuario.estado_usuario)) === String(estadoRechazadoId)).length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center font-sans text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

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
          <span className="text-3xl font-bold">{stats.todos}</span>
        </div>
        
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Activos</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.activos}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-sm font-medium text-gray-600">Con Cambios</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.cambios}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Rechazados</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.rechazados}</span>
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
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none"
            placeholder="Buscar por ID, nombre, email..."
          />
        </div>
        <select
          value={estadoFiltro}
          onChange={(event) => setEstadoFiltro(event.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none"
        >
          {estadoOpciones.map((estado) => (
            <option key={estado.value ?? estado.id_estado} value={estado.value ?? estado.id_estado}>
              {estado.label ?? estado.nombre}
            </option>
          ))}
        </select>
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
              {usuariosFiltrados.map((user) => (
                <tr key={user.id_usuario ?? user.id_usuario_display} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.id_usuario_display}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.nombre_completo}</td>
                  <td className="px-6 py-4">{user.tipo_rol}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.telefono}</td>
                  <td className="px-6 py-4">{getEstadoBadge(user.estado_usuario)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {user.solicitudes_cambio ? (
                        <span className="flex items-center justify-center w-6 h-6 bg-[#FFF4D2] text-[#8B6E00] rounded-full text-xs font-bold">
                          {user.solicitudes_cambio}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => abrirModal(user)}
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
          Mostrando <span className="font-bold text-gray-900 mx-1">{usuariosFiltrados.length}</span> de <span className="font-bold text-gray-900 mx-1">{usuarios.length}</span> usuarios
        </div>
      </div>

      {/* Modal Integrado */}
      <ModalRevisarUsuario 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        usuarioId={usuarioSeleccionado?.id_usuario ?? usuarioSeleccionado?.id_usuario_display}
        usuarioData={usuarioSeleccionado}
      />
      
    </div>
  );
}
