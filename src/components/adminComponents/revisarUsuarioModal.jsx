/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function ModalRevisarUsuario({ isOpen, onClose, usuarioId, usuarioData }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (usuarioData) {
      setData({
        id: usuarioData.id_usuario_display ?? usuarioData.id_usuario ?? usuarioId ?? 'USR-010',
        nombre_completo: usuarioData.nombre_completo || 'Sin nombre',
        correo: usuarioData.email || 'Sin correo',
        telefono: usuarioData.telefono || 'Sin teléfono',
        tipo_usuario: usuarioData.tipo_rol || 'Sin tipo',
        estado: usuarioData.estado_usuario || 'Activo',
        rol_administrativo: usuarioData.tipo_rol || 'Administrador',
        departamento: usuarioData.ciudad || 'Sin ciudad'
      });
      setNotas('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setData(null);
  }, [isOpen, usuarioData, usuarioId]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between z-10 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Revisar Usuario - {data?.id || '...'}
            </h2>
            {data?.estado && (
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium font-sans ${
                data.estado === 'Activo' ? 'bg-green-100 text-green-700' :
                data.estado === 'Rechazado' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {data.estado}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-8 space-y-8 flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 font-sans text-gray-500">
              Cargando información...
            </div>
          ) : data ? (
            <>
              {/* Información del Usuario */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Usuario</h3>
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
                    <p className="text-xs text-gray-500 font-sans mb-1">Tipo de Usuario</p>
                    <p className="text-base text-gray-900 font-medium">{data.tipo_usuario}</p>
                  </div>
                </div>
              </section>

              {/* Información Administrativa */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Información Administrativa</h3>
                <div className="bg-[#F8F9FA] p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Rol</p>
                    <p className="text-base text-gray-900 font-medium">{data.rol_administrativo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-sans mb-1">Departamento</p>
                    <p className="text-base text-gray-900 font-medium">{data.departamento}</p>
                  </div>
                </div>
              </section>

              {/* Notas del Administrador */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notas del Administrador</h3>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Agrega observaciones sobre la revisión de este usuario..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none transition-all font-sans text-sm resize-none"
                ></textarea>
              </section>
            </>
          ) : (
            <div className="flex justify-center items-center h-40 font-sans text-gray-500">
              No hay información disponible para revisar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
