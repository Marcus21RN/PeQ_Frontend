/* eslint-disable no-unused-vars */

// src/pages/comercial/MiPerfilComercial.jsx
import { useState, useEffect } from 'react';
import { User, Home, FileText, Eye, Upload, Lock, Clock, Edit } from 'lucide-react';
import ModalEditarPerfilComercial from '../../components/comercialComponents/editarPerfilModal.jsx';
import SolicitudesCambioModal from '../../components/comercialComponents/solicitudCambioModal.jsx';
import ModalCambiarContraseña from '../../components/comercialComponents/cambiarContrasenaModal.jsx';

export default function MiPerfilComercial() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [perfil, setPerfil] = useState(null);
  // useEffect(() => {
  //   const fetchPerfil = async () => {
  //     try {
  //       const res = await api.get('/comercial/perfil/me');
  //       setPerfil(res.data);
  //     } catch (error) { console.error("Error al cargar perfil:", error); }
  //   };
  //   fetchPerfil();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  const mockPerfil = {
    nombre: 'Juan Pérez García',
    curp: 'PEGJ850101HDFRNN09',
    correo: 'juan.perez@email.com',
    telefono: '3331234567',
    tipoProductor: 'Activo',
    fechaRegistro: '14 de junio de 2024',
    rancho: {
      nombre: 'Rancho El Paraíso',
      municipio: 'Guadalajara',
      estado: 'Jalisco',
      cabezas: '50',
      capacidad: '100',
      hectareas: '45.5',
      direccion: 'Carretera Guadalajara-Chapala Km 15.5, Guadalajara, Jalisco',
      tipo: 'Comercial'
    },
    documentos: [
      { id: 1, titulo: 'Identificación Oficial (INE)', archivo: 'ine_jperez.pdf', subido: true },
      { id: 2, titulo: 'Acta Constitutiva o Registro Comercial', archivo: 'acta_constitucion.pdf', subido: true },
      { id: 3, titulo: 'RFC con Constancia de Situación Fiscal', archivo: 'rfc_situacion_fiscal.pdf', subido: true },
      { id: 4, titulo: 'Comprobante de Domicilio', archivo: 'comprobante_domicilio.pdf', subido: true },
      { id: 5, titulo: 'Permisos Sanitarios (SAGARPA/SENASICA)', archivo: 'permisos_sanitarios.pdf', subido: true },
      { id: 6, titulo: 'Licencia de Uso de Suelo', archivo: 'licencia_uso_suelo.pdf', subido: true },
      { id: 7, titulo: 'Fotografías de las Instalaciones', archivo: 'fotos_instalaciones.zip', subido: true },
      { id: 8, titulo: 'Plan de Manejo Sanitario', archivo: null, subido: false }, // Simulación de uno faltante
    ]
  };

  const handleDocumentUpload = (id) => {
    // Lógica para abrir explorador de archivos y enviar API
    console.log(`Abriendo input para subir documento ID: ${id}`);
  };

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
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">CURP</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.curp}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Correo Electrónico</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.correo}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Teléfono</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.telefono}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Tipo de Productor</p>
            <span className="bg-[#EAF3E6] text-[#387030] px-3 py-1 rounded-full text-xs font-bold inline-block mt-1">
              {mockPerfil.tipoProductor}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Fecha de Registro</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.fechaRegistro}</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Datos del Rancho */}
      <div className="bg-[#FDFDFB] border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <Home className="w-5 h-5 text-[#387030]" />
          <h2 className="text-lg font-bold text-gray-900 font-serif">Datos del Rancho</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Nombre del Rancho</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.nombre}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Municipio</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.municipio}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Estado</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.estado}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Número de Cabezas</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.cabezas}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Capacidad de Animales</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.capacidad}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Hectáreas</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.hectareas}</p>
          </div>
          <div className="md:col-span-1">
            <p className="text-xs text-gray-400 font-sans mb-1">Dirección</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.direccion}</p>
          </div>
          <div className="md:col-span-1">
            <p className="text-xs text-gray-400 font-sans mb-1">Tipo de Rancho</p>
            <p className="text-base text-gray-900 font-medium font-serif">{mockPerfil.rancho.tipo}</p>
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
          {mockPerfil.documentos.map((doc) => (
            <div key={doc.id} className="border border-gray-100 bg-white rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#F4F6F0] rounded-lg">
                  <FileText className="w-5 h-5 text-[#5C743D]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 font-serif text-sm">{doc.titulo}</p>
                  <p className="text-xs text-gray-400">{doc.subido ? doc.archivo : 'Documento pendiente'}</p>
                </div>
              </div>
              
              {/* Acción dinámica: Ver si existe, Subir si no */}
              {doc.subido ? (
                <button className="text-[#387030] hover:text-[#2c5726] flex items-center gap-1.5 text-sm font-semibold transition-colors">
                  <Eye className="w-4 h-4" /> Ver
                </button>
              ) : (
                <button onClick={() => handleDocumentUpload(doc.id)} className="text-[#D97706] hover:text-[#B45309] flex items-center gap-1.5 text-sm font-semibold transition-colors">
                  <Upload className="w-4 h-4" /> Subir
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 4: Footer de Acciones (Preparados para que les asignes rutas/modales) */}
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

      {/* Renderizado de Modales Activos */}
      <ModalEditarPerfilComercial 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        dataActual={mockPerfil} 
      />
    
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
