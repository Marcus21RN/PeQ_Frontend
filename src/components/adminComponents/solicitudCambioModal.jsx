/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { X, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { getSolicitudesCambioAdministrador } from '../../services/apiAdmin/panelAdmin.js';

export default function ModalSolicitudesCambio({ isOpen, onClose, usuarioId }) {
  const [filtro, setFiltro] = useState('Todos');
  const [solicitudes, setSolicitudes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const cargarSolicitudes = async () => {
      try {
        setIsLoading(true);
        const data = await getSolicitudesCambioAdministrador(usuarioId ? { id_usuario: usuarioId } : {});
        if (!isMounted) return;
        setSolicitudes(data);
        setError(null);
      } catch (requestError) {
        console.error('Error al cargar solicitudes de cambio:', requestError);
        if (isMounted) {
          setError('No se pudieron cargar las solicitudes de cambio.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    cargarSolicitudes();

    return () => {
      isMounted = false;
    };
  }, [isOpen, usuarioId]);

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    if (filtro === 'Todos') return true;
    return solicitud.estado === filtro;
  });

  const getIconoEstado = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <div className="p-2 bg-yellow-100 rounded-full"><Clock className="w-5 h-5 text-yellow-600" /></div>;
      case 'Aprobado':
        return <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="w-5 h-5 text-green-600" /></div>;
      case 'Rechazado':
        return <div className="p-2 bg-red-100 rounded-full"><XCircle className="w-5 h-5 text-red-600" /></div>;
      default:
        return <div className="p-2 bg-gray-100 rounded-full"><Clock className="w-5 h-5 text-gray-500" /></div>;
    }
  };

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return <span className="bg-[#FDF0D5] text-[#8B6E00] px-3 py-1 rounded-full text-xs font-medium">Pendiente</span>;
      case 'Aprobado':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Aprobado</span>;
      case 'Rechazado':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Rechazado</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{estado || 'Sin estado'}</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col font-serif shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#EAB308]" />
            <h2 className="text-xl font-bold text-gray-900">Solicitudes de Cambio</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pt-4 border-b border-gray-100 flex gap-4 font-sans shrink-0">
          {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFiltro(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                filtro === tab ? 'border-[#5A3B2A] text-[#5A3B2A]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'Pendiente' ? 'Pendientes' : tab === 'Aprobado' ? 'Aprobadas' : tab === 'Rechazado' ? 'Rechazadas' : 'Todas'}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {isLoading ? (
            <div className="text-center text-gray-500 py-10">Cargando historial...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-10">{error}</div>
          ) : solicitudesFiltradas.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No hay solicitudes en esta categoría.</div>
          ) : (
            <div className="space-y-4">
              {solicitudesFiltradas.map((sol) => (
                <div key={sol.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 items-start hover:bg-gray-50 transition-colors">
                  {getIconoEstado(sol.estado)}

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-900 font-serif">Cambio en: {sol.campo}</p>
                      <span className="text-sm text-gray-400 font-serif">{sol.fecha}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="line-through text-gray-400 font-serif text-sm">{sol.valorAnterior}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-[#5A3B2A] font-serif text-sm">{sol.valorNuevo}</span>
                    </div>

                    {sol.estado === 'Rechazado' && sol.motivoRechazo && (
                      <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded-md border border-red-100">
                        Motivo: {sol.motivoRechazo}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 ml-4">
                    {getBadgeEstado(sol.estado)}
                    {sol.estado === 'Pendiente' && (
                      <span className="text-xs text-gray-400">Solo lectura hasta que exista contrato de mutación</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
