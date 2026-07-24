/* eslint-disable react-hooks/set-state-in-effect */

// MODAL DE REVISIÓN DE SOLICITUD (ADMIN)

import { useEffect, useState } from 'react';
import { X, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function ModalRevisionSolicitud({ isOpen, onClose, solicitudId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // useEffect(() => {
  //   if (!isOpen || !solicitudId) return;
  //   
  //   const fetchDetalleSolicitud = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Petición al endpoint de FastAPI (ej: /admin/solicitudes/{id})
  //       const response = await api.get(`/admin/solicitudes/${solicitudId}`);
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Error al obtener detalle de la solicitud:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   fetchDetalleSolicitud();
  // }, [isOpen, solicitudId]);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // Simulamos la carga de datos al abrir el modal
  // ==========================================
  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoading(true);
    // Simulamos un retraso de red de medio segundo
    const timer = setTimeout(() => {
      setData({
        id_registro: 'REG-001',
        nombre_completo: 'Carlos Mendoza',
        tipo_usuario: 'Rancho Comercial',
        correo: 'carlos.mendoza@email.com',
        telefono: '5551234567',
        rancho: 'Rancho La Esperanza',
        municipio: 'Guadalajara',
        estado: 'Jalisco',
        documento_url: '#' // Aquí iría la URL del PDF del backend
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isOpen, solicitudId]);

  // Funciones de acción (Aprobar/Rechazar) para cuando conectes la API
  const handleAprobar = async () => {
    // await api.post(`/admin/solicitudes/${solicitudId}/aprobar`);
    console.log("Aprobando solicitud", solicitudId);
    onClose();
  };

  const handleRechazar = async () => {
    // await api.post(`/admin/solicitudes/${solicitudId}/rechazar`);
    console.log("Rechazando solicitud", solicitudId);
    onClose();
  };

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    // Overlay de fondo oscuro con desenfoque
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose} // Cierra al hacer clic fuera del modal
    >
      {/* Contenedor del Modal */}
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col font-serif"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        
        {/* Cabecera pegajosa */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            Revisión de Solicitud - {data?.id_registro || 'Cargando...'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-8 flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-gray-500 font-sans">Cargando información...</span>
            </div>
          ) : (
            <>
              {/* Sección: Datos Personales */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Datos Personales</h3>
                <div className="bg-gray-50 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Nombre Completo</p>
                    <p className="text-sm text-gray-900 font-medium">{data.nombre_completo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Tipo de Usuario</p>
                    <p className="text-sm text-gray-900 font-medium">{data.tipo_usuario}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Correo Electrónico</p>
                    <p className="text-sm text-gray-900 font-medium">{data.correo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Teléfono</p>
                    <p className="text-sm text-gray-900 font-medium">{data.telefono}</p>
                  </div>
                </div>
              </section>

              {/* Sección: Información del Rancho/Ubicación */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Información del Rancho/Ubicación</h3>
                <div className="bg-gray-50 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Nombre del Rancho</p>
                    <p className="text-sm text-gray-900 font-medium">{data.rancho}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Municipio</p>
                    <p className="text-sm text-gray-900 font-medium">{data.municipio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Estado</p>
                    <p className="text-sm text-gray-900 font-medium">{data.estado}</p>
                  </div>
                </div>
              </section>

              {/* Sección: Documentación Adjunta */}
              <section>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Documentación Adjunta</h3>
                <div className="bg-gray-50 p-5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium font-sans">Identificación Oficial y Comprobante</p>
                      <p className="text-xs text-gray-500 font-sans">PDF • 2.4 MB</p>
                    </div>
                  </div>
                  <a 
                    href={data.documento_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 font-sans underline"
                  >
                    Ver Documento
                  </a>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Pie del Modal (Botones de Acción) */}
        {!isLoading && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 font-sans">
            <button 
              onClick={handleRechazar}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4 text-red-500" />
              Rechazar
            </button>
            <button 
              onClick={handleAprobar}
              className="px-6 py-2 bg-[#2E6B2C] text-white rounded-lg hover:bg-[#235322] text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Aprobar Solicitud
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
