//eslint-disable no-unused-vars 
import { useState, useEffect } from 'react';
import { User, Home, FileText, Eye, Upload, Lock, Clock, Edit } from 'lucide-react';
import ModalEditarPerfilComercial from '../../components/comercialComponents/editarPerfilModal.jsx';
import SolicitudesCambioModal from '../../components/comercialComponents/solicitudCambioModal.jsx';
import ModalCambiarContraseña from '../../components/comercialComponents/cambiarContrasenaModal.jsx';
import { getPerfilProductor } from '../../services/apiTraspatio/perfilProductor';

export default function MiPerfilComercial() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para recargar perfil desde modales
  const recargarPerfil = async () => {
    try {
      const data = await getPerfilProductor();
      setPerfil(data);
    } catch (err) {
      console.error('Error al recargar el perfil:', err);
    }
  };

  // Carga inicial sin llamadas síncronas a setState dentro de useEffect
  useEffect(() => {
    let isMounted = true;

    getPerfilProductor()
      .then((data) => {
        if (isMounted) {
          setPerfil(data);
          setError(null);
        }
      })
      .catch((err) => {
        console.error('Error al cargar la información del perfil:', err);
        if (isMounted) {
          setError('No se pudo cargar la información del perfil. Verifica tu conexión o sesión.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDocumentUpload = (id) => {
    console.log(`Subiendo documento ID: ${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando información del perfil...</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center font-sans text-red-600">
        <p className="text-lg">{error || 'No se encontró la información del perfil.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-serif pb-10">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 mt-2 font-sans">Consulta y gestiona tu información personal</p>
      </div>

      {/* SECCIÓN 1: Datos Personales */}
      <div className="bg-[#FDFDFB] border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <User className="w-5 h-5 text-[#387030]" />
          <h2 className="text-lg font-bold text-gray-900 font-serif">Datos Personales</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Nombre Completo</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.nombre_completo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Correo Electrónico</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Teléfono</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.telefono || 'Sin registrar'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Tipo de Productor</p>
            <span className="bg-[#EAF3E6] text-[#387030] px-3 py-1 rounded-full text-xs font-bold inline-block mt-1">
              {perfil.tipo_productor || 'Productor de Traspatio'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Fecha de Registro</p>
            <p className="text-base text-gray-900 font-medium font-serif">
              {perfil.fecha_registro ? new Date(perfil.fecha_registro).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Datos del Rancho / Instalación */}
      <div className="bg-[#FDFDFB] border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <Home className="w-5 h-5 text-[#387030]" />
          <h2 className="text-lg font-bold text-gray-900 font-serif">Datos del Rancho / Predio</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Nombre del Rancho</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.nombre_rancho || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Municipio / Ciudad</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.municipio || perfil.ciudad || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Estado</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.estado_ubicacion || 'Activo'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Capacidad de Animales</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.capacidad_animales ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Superficie (Hectáreas)</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.superficie_hectareas ?? 'N/A'}</p>
          </div>
          <div className="md:col-span-1">
            <p className="text-xs text-gray-400 font-sans mb-1">Dirección</p>
            <p className="text-base text-gray-900 font-medium font-serif">{perfil.direccion || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Documentación Personal */}
      <div className="bg-[#FDFDFB] border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#387030]" />
          <h2 className="text-lg font-bold text-gray-900 font-serif">Documentación Personal</h2>
        </div>
        <div className="p-6 space-y-4">
          {perfil.documentos && perfil.documentos.length > 0 ? (
            perfil.documentos.map((doc, index) => (
              <div key={doc.id || index} className="border border-gray-100 bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#F4F6F0] rounded-lg">
                    <FileText className="w-5 h-5 text-[#5C743D]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 font-serif text-sm">{doc.titulo || doc.tipo_documento || 'Documento'}</p>
                    <p className="text-xs text-gray-400">{doc.subido || doc.enlace_archivo ? (doc.archivo || doc.enlace_archivo) : 'Documento pendiente'}</p>
                  </div>
                </div>
                
                {(doc.subido || doc.enlace_archivo) ? (
                  <a
                    href={doc.enlace_archivo || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#387030] hover:text-[#2c5726] flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Ver
                  </a>
                ) : (
                  <button onClick={() => handleDocumentUpload(doc.id)} className="text-[#D97706] hover:text-[#B45309] flex items-center gap-1.5 text-sm font-semibold transition-colors">
                    <Upload className="w-4 h-4" /> Subir
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No hay documentos registrados para esta cuenta.</p>
          )}
        </div>
      </div>

      {/* SECCIÓN 4: Botones de Acción */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-center gap-4 font-sans">
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 border-2 border-[#387030] text-[#387030] rounded-xl hover:bg-[#F4F6F0] text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" /> Cambiar Contraseña
        </button>
        
        <button 
          onClick={() => setIsRequestsModalOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 border-2 border-[#EAB308] text-[#D97706] rounded-xl hover:bg-yellow-50 text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="w-4 h-4" /> Solicitudes de Cambio
        </button>

        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="w-full md:w-auto px-8 py-3.5 bg-[#387030] text-white rounded-xl hover:bg-[#2E5A26] text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Edit className="w-4 h-4" /> Editar Perfil
        </button>
      </div>

      {/* Modal de edición renderizado condicionalmente según apertura */}
      {isEditModalOpen && (
        <ModalEditarPerfilComercial 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          perfilActual={perfil}
          onActualizado={recargarPerfil}
        />
      )}
    
      <SolicitudesCambioModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />

      <ModalCambiarContraseña
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

    </div>
  );
}