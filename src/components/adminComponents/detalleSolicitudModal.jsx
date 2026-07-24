/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { X, XCircle, Clock, CheckCircle } from 'lucide-react';

export default function ModalDetalleSolicitud({ isOpen, onClose, solicitudId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notas, setNotas] = useState('');

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // useEffect(() => {
  //   if (!isOpen || !solicitudId) return;
  //   
  //   const fetchSolicitud = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await api.get(`/admin/solicitudes/${solicitudId}`);
  //       setData(response.data);
  //       setNotas(response.data.notas_admin || '');
  //     } catch (error) {
  //       console.error("Error al obtener detalle:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchSolicitud();
  // }, [isOpen, solicitudId]);
  
  // const handleAccion = async (accion) => {
  //   try {
  //     await api.post(`/admin/solicitudes/${solicitudId}/${accion}`, { notas });
  //     onClose(); // Cerrar y recargar la tabla principal
  //   } catch(error) {
  //     console.error("Error al actualizar estado", error);
  //   }
  // }

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData({
        id: solicitudId || 'SOL-R002',
        nombre_completo: 'Luis García López',
        correo: 'luis.garcia@email.com',
        telefono: '5556789012',
        ciudad: 'Zapopan',
        direccion: 'Calle 5 de Mayo #123',
        rancho: 'Traspatio El Carmen',
        capacidad: '50 animales',
        superficie: '2 hectáreas',
        documentos: [
          { nombre: 'Identificación Oficial (INE/Pasaporte)', url: '#' },
          { nombre: 'Comprobante de Domicilio', url: '#' },
          { nombre: 'Constancia de Residencia', url: '#' },
          { nombre: 'Fotografías del Rancho', url: '#' },
        ]
      });
      setNotas('');
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [isOpen, solicitudId]);

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
        {/* Cabecera Sticky */}
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

        {/* Cuerpo Scrolleable */}
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 font-sans text-gray-500">
              Cargando información...
            </div>
          ) : (
            <>
              {/* Datos Personales */}
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

              {/* Información del Rancho */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Rancho</h3>
                <div className="bg-[#F8F9FA] p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Nombre del Rancho</p>
                    <p className="text-base text-gray-900 font-medium">{data.rancho}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Capacidad (Animales)</p>
                    <p className="text-base text-gray-900 font-medium">{data.capacidad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Superficie (Hectáreas)</p>
                    <p className="text-base text-gray-900 font-medium">{data.superficie}</p>
                  </div>
                </div>
              </section>

              {/* Documentación Adjunta */}
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

              {/* Notas del Administrador */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notas del Administrador</h3>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agrega tus observaciones sobre la revisión de esta solicitud..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none transition-all font-sans text-sm resize-none"
                ></textarea>
              </section>
            </>
          )}
        </div>

        {/* Footer (Botones de Acción) Sticky */}
        {!isLoading && (
          <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
              <button 
                onClick={() => console.log('Rechazar')}
                className="py-3 px-4 border border-red-500 text-red-600 rounded-xl hover:bg-red-50 text-sm font-semibold transition-colors flex justify-center items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Rechazar
              </button>
              
              <button 
                onClick={() => console.log('Pendiente')}
                className="py-3 px-4 border border-yellow-500 text-yellow-600 rounded-xl hover:bg-yellow-50 text-sm font-semibold transition-colors flex justify-center items-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Dejar Pendiente
              </button>
              
              <button 
                onClick={() => console.log('Aprobar')}
                className="py-3 px-4 bg-[#5A3B2A] hover:bg-[#4A2F22] text-white rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2 shadow-md"
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
