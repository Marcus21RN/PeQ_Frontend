/* eslint-disable react-hooks/set-state-in-effect */

// MODAL DE REVISIÓN DE SOLICITUD (ADMIN)

import { useEffect, useState } from 'react';
import { X, FileText, CheckCircle, XCircle } from 'lucide-react';
import { getEstadoIdPorNombre, getEstadoNombrePorId, getEstadosCatalogo, actualizarUsuarioAdministrador } from '../../services/apiAdmin/panelAdmin.js';

export default function ModalRevisionSolicitud({ isOpen, onClose, solicitudId, solicitudData, onUpdated }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
        id_registro: solicitudData.id_usuario_display ?? solicitudData.id_usuario ?? solicitudId ?? 'REG-001',
        nombre_completo: solicitudData.nombre_completo || 'Sin nombre',
        tipo_usuario: solicitudData.tipo_rol || 'Sin tipo',
        correo: solicitudData.email || 'Sin correo',
        telefono: solicitudData.telefono || 'Sin teléfono',
        rancho: solicitudData.tipo_rol || 'Sin tipo de usuario',
        municipio: solicitudData.ciudad || 'Sin ciudad',
        estado: estadoCatalogo || solicitudData.estado_usuario || 'Pendiente de revisión',
        documento_url: '#',
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setData(null);
  }, [isOpen, solicitudData, solicitudId, estadosCatalogo]);

  const estadoRechazadoId = getEstadoIdPorNombre(estadosCatalogo, 'Rechazado');
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
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col font-serif"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="p-6 space-y-8 flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-gray-500 font-sans">Cargando información...</span>
            </div>
          ) : data ? (
            <>
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
          ) : (
            <div className="flex justify-center items-center h-40">
              <span className="text-gray-500 font-sans">No hay información disponible para esta solicitud.</span>
            </div>
          )}
        </div>

        {!isLoading && data && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 font-sans">
            <button
              onClick={() => cambiarEstado('Rechazado')}
              disabled={isSubmitting || !estadoRechazadoId}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <XCircle className="w-4 h-4 text-red-500" />
              Rechazar
            </button>
            <button
              onClick={() => cambiarEstado('Aprobado')}
              disabled={isSubmitting || !estadoAprobadoId}
              className="px-6 py-2 bg-[#2E6B2C] text-white rounded-lg hover:bg-[#235322] text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
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
