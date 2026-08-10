import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

import ModalRevisionSolicitud from '../../components/adminComponents/revisionSolicitudModal.jsx';
import { getEstadoIdPorNombre, getEstadosCatalogo, getSolicitudesRegistro, getUsuariosActivos } from '../../services/apiAdmin/panelAdmin.js';

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [usuariosActivos, setUsuariosActivos] = useState([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [estadosCatalogo, setEstadosCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abrirModalRevisar = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setIsModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const cargarDatosAsync = async () => {
      try {
        const [activos, estados] = await Promise.all([
          getUsuariosActivos(),
          getEstadosCatalogo().catch(() => []),
        ]);

        const estadoPendienteId = getEstadoIdPorNombre(estados, 'Pendiente de Revisión') ?? getEstadoIdPorNombre(estados, 'Pendiente');
        const solicitudes = await getSolicitudesRegistro(estadoPendienteId ? { id_estado: estadoPendienteId } : {});

        if (!isMounted) return;
        setUsuariosActivos(activos);
        setSolicitudesPendientes(solicitudes);
        setEstadosCatalogo(estados);
        setError(null);
      } catch (requestError) {
        console.error('Error cargando el dashboard admin:', requestError);
        if (isMounted) {
          setError('No se pudieron cargar los indicadores del panel administrativo.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarDatosAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando panel administrativo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center font-sans text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-serif">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-2 font-sans">Gestiona usuarios y genera reportes del sistema</p>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {usuariosActivos.slice(0, 3).map((item) => (
          <div key={item.id ?? item.tipo_usuario} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-500">{item.tipo_usuario}</span>
            <span className="text-4xl font-bold text-gray-900 mt-4 mb-2">{item.total_usuarios_activos}</span>
            <span className="text-xs text-gray-400">Usuarios activos</span>
          </div>
        ))}
      </div>

      {/* Sección de Solicitudes Pendientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm font-sans overflow-hidden">
        
        {/* Cabecera de la sección */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Solicitudes de Registro Pendientes</h2>
            <p className="text-sm text-gray-500 mt-1">Revisa y aprueba los nuevos registros</p>
          </div>
          <span className="bg-[#FFF4D2] text-[#8B6E00] px-3 py-1 rounded-full text-sm font-medium">
            {solicitudesPendientes.length} pendientes
          </span>
        </div>

        {/* Lista de Solicitudes */}
        <div className="flex flex-col">
          {solicitudesPendientes.map((solicitud, index) => (
            <div 
              key={solicitud.id_usuario ?? solicitud.id_usuario_display ?? index} 
              className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-gray-50 transition-colors ${
                index !== solicitudesPendientes.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* Información del usuario */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 font-serif">{solicitud.nombre_completo}</h3>
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-100">
                    {solicitud.tipo_rol}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span> {solicitud.email}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Teléfono:</span> {solicitud.telefono}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">ID:</span> {solicitud.id_usuario_display}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 mt-3">
                  Solicitado el {solicitud.fecha_solicitud}
                </div>
              </div>

              {/* Botón de Acción */}
              <div>
                <button onClick={() => abrirModalRevisar(solicitud)} className="bg-[#5A3B2A] hover:bg-[#4A2F22] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                  <Eye className="w-4 h-4" />
                  Revisar
                </button>
              </div>
            </div>
          ))}
        </div>

        <ModalRevisionSolicitud 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          solicitudId={solicitudSeleccionada?.id_usuario ?? solicitudSeleccionada?.id_usuario_display}
          solicitudData={solicitudSeleccionada}
          onUpdated={async () => {
            setLoading(true);
            try {
              const [activos, estados] = await Promise.all([
                getUsuariosActivos(),
                getEstadosCatalogo().catch(() => estadosCatalogo),
              ]);
              const estadoPendienteId = getEstadoIdPorNombre(estados, 'Pendiente de Revisión') ?? getEstadoIdPorNombre(estados, 'Pendiente');
              const solicitudes = await getSolicitudesRegistro(estadoPendienteId ? { id_estado: estadoPendienteId } : {});
              setUsuariosActivos(activos);
              setSolicitudesPendientes(solicitudes);
              setEstadosCatalogo(estados);
            } finally {
              setLoading(false);
            }
          }}
        />
        
      </div>

    </div>
  );
}
