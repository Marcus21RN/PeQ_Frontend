import { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import ModalDetalleSolicitud from '../../components/adminComponents/detalleSolicitudModal.jsx';
import { getEstadoIdPorNombre, getEstadosCatalogo, getSolicitudesRegistro } from '../../services/apiAdmin/panelAdmin.js';

export default function TodasLasSolicitudes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [estadosCatalogo, setEstadosCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');

  useEffect(() => {
    let isMounted = true;

    const cargarSolicitudesAsync = async () => {
      try {
        const [data, estados] = await Promise.all([
          getSolicitudesRegistro(),
          getEstadosCatalogo().catch(() => []),
        ]);
        if (!isMounted) return;
        setSolicitudes(data);
        setEstadosCatalogo(estados);
        setError(null);
      } catch (requestError) {
        console.error('Error al cargar solicitudes admin:', requestError);
        if (isMounted) {
          setError('No se pudo cargar la lista de solicitudes.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarSolicitudesAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  const abrirModal = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setIsModalOpen(true);
  };

  const estadoPendienteId = getEstadoIdPorNombre(estadosCatalogo, 'Pendiente de Revisión');
  const estadoEnRevisionId = getEstadoIdPorNombre(estadosCatalogo, 'En Revisión');
  const estadoAprobadoId = getEstadoIdPorNombre(estadosCatalogo, 'Aprobado');
  const estadoRechazadoId = getEstadoIdPorNombre(estadosCatalogo, 'Rechazado');

  const getEstadoIdSolicitud = (estado) => getEstadoIdPorNombre(estadosCatalogo, estado);

  const getEstadoBadge = (estado) => {
    const estadoId = getEstadoIdSolicitud(estado);

    if (String(estadoId) === String(estadoPendienteId) || String(estadoId) === String(estadoEnRevisionId)) {
      return <span className="bg-[#FFF4D2] text-[#8B6E00] px-3 py-1 rounded-full text-xs font-medium">Pendiente de revisión</span>;
    }

    if (String(estadoId) === String(estadoAprobadoId)) {
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Aprobado</span>;
    }

    if (String(estadoId) === String(estadoRechazadoId)) {
      return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Rechazado</span>;
    }

    return estado ? <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{estado}</span> : null;
  };

  const estadoOpciones = [
    { value: 'todos', label: 'Todos' },
    ...estadosCatalogo,
  ];

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const search = searchTerm.trim().toLowerCase();
    const coincideBusqueda = !search || [
      solicitud.id_usuario_display,
      solicitud.nombre_completo,
      solicitud.tipo_rol,
      solicitud.email,
      solicitud.telefono,
      solicitud.estado_usuario,
      solicitud.fecha_solicitud,
    ].some((value) => (value || '').toLowerCase().includes(search));

    if (!coincideBusqueda) {
      return false;
    }

    if (estadoFiltro === 'todos') {
      return true;
    }

    return String(getEstadoIdSolicitud(solicitud.estado_usuario)) === String(estadoFiltro);
  });

  const stats = {
    todas: solicitudes.length,
    pendientes: solicitudes.filter((solicitud) => {
      const estadoId = getEstadoIdSolicitud(solicitud.estado_usuario);
      return String(estadoId) === String(estadoPendienteId) || String(estadoId) === String(estadoEnRevisionId);
    }).length,
    aprobadas: solicitudes.filter((solicitud) => String(getEstadoIdSolicitud(solicitud.estado_usuario)) === String(estadoAprobadoId)).length,
    rechazadas: solicitudes.filter((solicitud) => String(getEstadoIdSolicitud(solicitud.estado_usuario)) === String(estadoRechazadoId)).length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando solicitudes...</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Todas las Solicitudes</h1>
        <p className="text-gray-500 mt-2 font-sans">Gestiona y revisa las solicitudes de registro pendientes</p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
        <div className="bg-[#5A3B2A] text-white p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm font-medium">Todas</span>
          </div>
          <span className="text-3xl font-bold">{stats.todas}</span>
        </div>
        
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
            <span className="text-sm font-medium text-gray-600">Pendientes</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.pendientes}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Aprobadas</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.aprobadas}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Rechazadas</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.rechazadas}</span>
        </div>
      </div>

      {/* Buscador */}
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

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Solicitud</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {solicitudesFiltradas.map((sol) => (
                <tr key={sol.id_usuario ?? sol.id_usuario_display} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{sol.id_usuario_display}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 wrap-break-word">{sol.tipo_rol}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="w-32 wrap-break-word">{sol.nombre_completo}</div>
                  </td>
                  <td className="px-6 py-4">{sol.email}</td>
                  <td className="px-6 py-4">{sol.telefono}</td>
                  <td className="px-6 py-4">
                    <div className="w-16 wrap-break-word">{sol.fecha_solicitud}</div>
                  </td>
                  <td className="px-6 py-4">{getEstadoBadge(sol.estado_usuario)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => abrirModal(sol)}
                        className="bg-[#5A3B2A] hover:bg-[#4A2F22] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Revisar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
          Mostrando <span className="font-bold text-gray-900 mx-1">{solicitudesFiltradas.length}</span> de <span className="font-bold text-gray-900 mx-1">{solicitudes.length}</span> solicitudes
        </div>
      </div>

      <ModalDetalleSolicitud 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        solicitudId={solicitudSeleccionada?.id_usuario ?? solicitudSeleccionada?.id_usuario_display}
        solicitudData={solicitudSeleccionada}
        onUpdated={async () => {
          setLoading(true);
          try {
            const [data, estados] = await Promise.all([
              getSolicitudesRegistro(),
              getEstadosCatalogo().catch(() => estadosCatalogo),
            ]);
            setSolicitudes(data);
            setEstadosCatalogo(estados);
          } finally {
            setLoading(false);
          }
        }}
      />
      
    </div>
  );
}
