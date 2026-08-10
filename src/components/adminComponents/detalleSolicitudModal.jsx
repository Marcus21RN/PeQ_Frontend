/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { X, XCircle, Clock, CheckCircle } from 'lucide-react';
import { getEstadoIdPorNombre, getEstadoNombrePorId, getEstadosCatalogo, actualizarUsuarioAdministrador } from '../../services/apiAdmin/panelAdmin.js';

export default function ModalDetalleSolicitud({ isOpen, onClose, solicitudId, solicitudData, onUpdated }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estadosCatalogo, setEstadosCatalogo] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const cargarEstados = async () => {
      try {
        const catalogo = await getEstadosCatalogo();
        if (isMounted) {
          setEstadosCatalogo(catalogo);
        }
      } catch (error) {
        console.error('Error al cargar el catálogo de estados:', error);
        if (isMounted) {
          setEstadosCatalogo([]);
        }
      }
    };

    cargarEstados();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (solicitudData) {
      const estadoCatalogo = getEstadoNombrePorId(
        estadosCatalogo,
        getEstadoIdPorNombre(estadosCatalogo, solicitudData.estado_usuario) ?? solicitudData.id_estado,
      );

      setData({
        id: solicitudData.id_usuario_display ?? solicitudData.id_usuario ?? solicitudId ?? 'SOL-R002',
        nombre_completo: solicitudData.nombre_completo || 'Sin nombre',
        correo: solicitudData.email || 'Sin correo',
        telefono: solicitudData.telefono || 'Sin teléfono',
        ciudad: solicitudData.ciudad || 'Sin ciudad',
        direccion: solicitudData.ciudad ? `Ubicado en ${solicitudData.ciudad}` : 'Sin dirección',
        rancho: solicitudData.tipo_rol || 'Sin tipo de usuario',
        capacidad: estadoCatalogo || solicitudData.estado_usuario || 'Pendiente de revisión',
        superficie: solicitudData.fecha_solicitud || 'Sin fecha',
        documentos: [
          { nombre: 'Registro del sistema', url: '#' },
          { nombre: 'Solicitud capturada', url: '#' },
        ],
      });
      setNotas('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setData(null);
  }, [isOpen, solicitudData, solicitudId, estadosCatalogo]);

  const estadoRechazadoId = getEstadoIdPorNombre(estadosCatalogo, 'Rechazado');
  const estadoPendienteId = getEstadoIdPorNombre(estadosCatalogo, 'Pendiente de Revisión');
  const estadoAprobadoId = getEstadoIdPorNombre(estadosCatalogo, 'Aprobado');

  const cambiarEstado = async (nuevoEstadoNombre) => {
    const nuevoEstadoId = getEstadoIdPorNombre(estadosCatalogo, nuevoEstadoNombre);

    if (!nuevoEstadoId) {
      console.error(`No se encontró el estado ${nuevoEstadoNombre} en el catálogo.`);
      return;
    }

    try {
      setIsSubmitting(true);
      await actualizarUsuarioAdministrador(solicitudId, { id_estado: nuevoEstadoId });
      onUpdated?.();
      onClose();
    } catch (error) {
      console.error(`Error al actualizar la solicitud a ${nuevoEstadoNombre}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col font-serif shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10 rounded-t-2xl shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            Revisar Solicitud - {data?.id || '...'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 font-sans text-gray-500">
              Cargando información...
            </div>
          ) : data ? (
            <>
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Datos Personales</h3>
                <div className="bg-[#F8F9FA] p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Nombre Completo</p>
                    <p className="text-base text-gray-900 font-medium">{data.nombre_completo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Correo Electrónico</p>
                    <p className="text-base text-gray-900 font-medium">{data.correo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Teléfono</p>
                    <p className="text-base text-gray-900 font-medium">{data.telefono}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Ciudad</p>
                    <p className="text-base text-gray-900 font-medium">{data.ciudad}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 font-sans mb-1">Dirección Completa</p>
                    <p className="text-base text-gray-900 font-medium">{data.direccion}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Rancho</h3>
                <div className="bg-[#F8F9FA] p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Nombre del Rancho</p>
                    <p className="text-base text-gray-900 font-medium">{data.rancho}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Capacidad (Estado)</p>
                    <p className="text-base text-gray-900 font-medium">{data.capacidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Fecha</p>
                    <p className="text-base text-gray-900 font-medium">{data.superficie}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Documentación Adjunta</h3>
                <div className="space-y-3 font-sans">
                  {data.documentos.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#F8F9FA] border border-gray-100 rounded-xl">
                      <span className="text-sm font-medium text-gray-800">{doc.nombre}</span>
                      <a href={doc.url} className="text-sm text-[#5A3B2A] hover:underline font-medium">
                        Ver documento →
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notas del Administrador</h3>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agrega tus observaciones sobre la revisión de esta solicitud..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none transition-all font-sans text-sm resize-none"
                />
              </section>
            </>
          ) : (
            <div className="flex justify-center items-center h-40 font-sans text-gray-500">
              No hay información disponible para esta solicitud.
            </div>
          )}
        </div>

        {!isLoading && data && (
          <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
              <button 
                  onClick={() => cambiarEstado('Rechazado')}
                  disabled={isSubmitting || !estadoRechazadoId}
                  className="py-3 px-4 border border-red-500 text-red-600 rounded-xl hover:bg-red-50 text-sm font-semibold transition-colors flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <XCircle className="w-5 h-5" />
                Rechazar
              </button>
              <button 
                  onClick={() => cambiarEstado('Pendiente de Revisión')}
                  disabled={isSubmitting || !estadoPendienteId}
                  className="py-3 px-4 border border-yellow-500 text-yellow-600 rounded-xl hover:bg-yellow-50 text-sm font-semibold transition-colors flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Clock className="w-5 h-5" />
                Dejar Pendiente
              </button>
              <button 
                  onClick={() => cambiarEstado('Aprobado')}
                  disabled={isSubmitting || !estadoAprobadoId}
                  className="py-3 px-4 bg-[#5A3B2A] hover:bg-[#4A2F22] text-white rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2 shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CheckCircle className="w-5 h-5" />
                Aprobar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
