/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { User, Shield, Lock, Clock, Edit } from 'lucide-react';
import ModalCambiarContrasena from '../../components/adminComponents/cambiarContrasenaModal.jsx';
import ModalEditarPerfil from '../../components/adminComponents/editarPerfilModal.jsx';
import ModalSolicitudesCambio from '../../components/adminComponents/solicitudCambioModal.jsx';

export default function MiPerfil() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSolicitudModalOpen, setIsSolicitudModalOpen] = useState(false);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [perfil, setPerfil] = useState(null);
  // useEffect(() => {
  //   const fetchPerfil = async () => {
  //     try {
  //       const res = await api.get('/admin/perfil/me');
  //       setPerfil(res.data);
  //     } catch (error) {
  //       console.error("Error al cargar perfil:", error);
  //     }
  //   };
  //   fetchPerfil();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  const mockPerfil = {
    nombre: 'Carlos Alberto Reyes',
    curp: 'REAC900520HDFYRL04',
    correo: 'admin@sistema-ganado.gob.mx',
    telefono: '5559001234',
    rol_sistema: 'Administrador General',
    miembro_desde: 'enero de 2023',
    ultimo_acceso: '12 de marzo de 2026', // Based on the current date context
    departamento: 'Regulación Pecuaria',
    municipio: 'Guadalajara',
    estado_geo: 'Jalisco',
    estado_cuenta: 'Activo',
    fecha_registro: '14 de enero de 2023'
  };

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
          <p className="text-lg font-bold text-gray-900 font-serif">{mockPerfil.rol_sistema}</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Miembro Desde</p>
          <p className="text-lg font-bold text-gray-900 font-serif">{mockPerfil.miembro_desde}</p>
        </div>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-gray-400 mb-2">Último Acceso</p>
          <p className="text-lg font-bold text-gray-900 font-serif">{mockPerfil.ultimo_acceso}</p>
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
            <p className="text-base text-gray-900 font-medium">{mockPerfil.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">CURP</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.curp}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Correo Electrónico</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.correo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Teléfono</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.telefono}</p>
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
              <p className="text-base text-gray-900 font-medium">{mockPerfil.rol_sistema}</p>
              <span className="bg-[#EFEBE4] text-[#5A3B2A] px-2 py-0.5 rounded-full text-xs font-sans font-medium">
                {mockPerfil.estado_cuenta}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Departamento</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.departamento}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Municipio</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.municipio}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Estado</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.estado_geo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Fecha de Registro</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.fecha_registro}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Último Acceso</p>
            <p className="text-base text-gray-900 font-medium">{mockPerfil.ultimo_acceso}</p>
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
      />

      <ModalEditarPerfil 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        dataActual={mockPerfil} 
      />

    </div>
  );
}
