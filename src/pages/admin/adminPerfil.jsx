import { useState, useEffect } from 'react';
import { User, Shield, Lock, Clock, Edit } from 'lucide-react';
import ModalCambiarContrasena from '../../components/adminComponents/cambiarContrasenaModal.jsx';
import ModalEditarPerfil from '../../components/adminComponents/editarPerfilModal.jsx';
import ModalSolicitudesCambio from '../../components/adminComponents/solicitudCambioModal.jsx';
import { getPerfilAdministrador } from '../../services/apiAdmin/panelAdmin.js';

export default function MiPerfil() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSolicitudModalOpen, setIsSolicitudModalOpen] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const cargarPerfilAsync = async () => {
      try {
        const data = await getPerfilAdministrador();
        if (!isMounted) return;
        setPerfil(data);
        setError(null);
      } catch (requestError) {
        console.error('Error al cargar el perfil admin:', requestError);
        if (isMounted) {
          setError('No se pudo cargar la información del perfil.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarPerfilAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center font-sans text-red-600">
        <p className="text-lg">{error || 'No se pudo obtener el perfil.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-serif pb-10">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 mt-2 font-sans">Consulta y gestiona tu información de administrador</p>
      </div>

      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Rol del Sistema</p>
          <p className="text-lg font-bold text-gray-900 font-serif">{perfil.rol_sistema}</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Miembro Desde</p>
          <p className="text-lg font-bold text-gray-900 font-serif">{perfil.miembro_desde}</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Estatus de la Cuenta</p>
          <p className="text-lg font-bold text-gray-900 font-serif">{perfil.estatus_cuenta}</p>
        </div>
      </div>

      {/* Sección 1: Datos Personales */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <User className="w-5 h-5 text-[#5A3B2A]" />
          <h2 className="text-lg font-bold text-gray-900">Datos Personales</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Nombre Completo</p>
            <p className="text-base text-gray-900 font-medium">{perfil.nombre_completo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Correo Electrónico</p>
            <p className="text-base text-gray-900 font-medium">{perfil.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Teléfono</p>
            <p className="text-base text-gray-900 font-medium">{perfil.telefono}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Ciudad</p>
            <p className="text-base text-gray-900 font-medium">{perfil.ciudad}</p>
          </div>
        </div>
      </div>

      {/* Sección 2: Información Administrativa */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#5A3B2A]" />
          <h2 className="text-lg font-bold text-gray-900">Información Administrativa</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Rol</p>
            <div className="flex items-center gap-3">
              <p className="text-base text-gray-900 font-medium">{perfil.rol_sistema}</p>
              <span className="bg-[#EFEBE4] text-[#5A3B2A] px-2 py-0.5 rounded-full text-xs font-sans font-medium">
                {perfil.estatus_cuenta}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Ciudad</p>
            <p className="text-base text-gray-900 font-medium">{perfil.ciudad}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Miembro Desde</p>
            <p className="text-base text-gray-900 font-medium">{perfil.miembro_desde}</p>
          </div>
        </div>
      </div>

      {/* Footer Acciones */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-end gap-4 font-sans">
        
        <button 
          onClick={() => setIsPasswordModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 border border-[#5A3B2A] text-[#5A3B2A] rounded-xl hover:bg-[#F8F9FA] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Cambiar Contraseña
        </button>
        
        <button 
          onClick={() => setIsSolicitudModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 border border-[#EAB308] text-[#EAB308] rounded-xl hover:bg-yellow-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Solicitudes de Cambio
        </button>

        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="w-full md:w-auto px-8 py-3 bg-[#5A3B2A] text-white rounded-xl hover:bg-[#4A2F22] text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Edit className="w-4 h-4" />
          Editar Perfil
        </button>

      </div>

      {/* Renderizado de Modales */}
      <ModalCambiarContrasena 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />

      <ModalSolicitudesCambio 
        isOpen={isSolicitudModalOpen} 
        onClose={() => setIsSolicitudModalOpen(false)} 
        usuarioId={perfil.id_usuario}
      />

      <ModalEditarPerfil 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        dataActual={perfil ? {
          id_usuario: perfil.id_usuario,
          nombre: perfil.nombre_completo,
          curp: '',
          correo: perfil.email,
          telefono: perfil.telefono,
          rol_sistema: perfil.rol_sistema,
          miembro_desde: perfil.miembro_desde,
          ultimo_acceso: perfil.miembro_desde,
          departamento: perfil.ciudad,
          municipio: perfil.ciudad,
          estado_geo: perfil.ciudad,
          fecha_registro: perfil.miembro_desde,
        } : null}
        onUpdated={cargarPerfil}
      />

    </div>
  );
}
