/* eslint-disable react-hooks/set-state-in-effect */

// src/components/comercial/ModalEditarPerfilComercial.jsx
import { useState, useEffect } from 'react';
import { X, Lock, TriangleAlert, User, Home } from 'lucide-react';

export default function ModalEditarPerfilComercial({ isOpen, onClose, dataActual }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     // Aquí enviarías los datos a un endpoint de "Solicitud de cambio"
  //     await api.post('/comercial/perfil/solicitar-cambio', formData);
  //     onClose(); 
  //   } catch (err) {
  //     console.error('Error al enviar la solicitud', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    if (dataActual) {
      setFormData(dataActual);
    }
  }, [dataActual, isOpen]);

  const handleInputChange = (e) => {
    // Si el input está anidado (ej. rancho.nombre), manejamos el estado anidado
    if (e.target.name.startsWith('rancho.')) {
      const field = e.target.name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        rancho: { ...prev.rancho, [field]: e.target.value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Simulando envío de cambios a revisión...", formData);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#F8F9FA] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col font-serif shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera */}
        <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
            <p className="text-gray-500 mt-1 font-sans text-sm">Realiza modificaciones a tu información personal y del rancho</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          
          {/* Alerta */}
          <div className="bg-[#FFF9E6] border border-[#FDE68A] p-4 rounded-xl flex items-start gap-3 mb-8">
            <TriangleAlert className="w-5 h-5 text-[#D97706] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#92400E] font-sans">Los cambios requieren aprobación</h3>
              <p className="text-sm text-[#92400E] font-sans mt-1">
                Cualquier modificación a tu información personal será revisada y aprobada por un administrador antes de aplicarse. Solo el cambio de contraseña es inmediato.
              </p>
            </div>
          </div>

          <form id="form-editar-perfil-comercial" onSubmit={handleSubmit} className="space-y-6 font-sans">
            
            {/* DATOS PERSONALES */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 font-serif text-lg font-bold text-[#2E4A25]">
                <User className="w-5 h-5" /> Datos Personales
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    CURP <Lock className="w-3 h-3"/> No editable
                  </label>
                  <p className="text-sm font-medium text-gray-900 py-3">{formData.curp}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Correo Electrónico</label>
                  <input type="email" name="correo" value={formData.correo || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    Tipo de Productor <Lock className="w-3 h-3"/> No editable
                  </label>
                  <div className="py-2">
                    <span className="bg-[#EAF3E6] text-[#387030] px-3 py-1 rounded-full text-xs font-bold">{formData.tipoProductor}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    Fecha de Registro <Lock className="w-3 h-3"/> No editable
                  </label>
                  <p className="text-sm font-medium text-gray-900 py-3">{formData.fechaRegistro}</p>
                </div>
              </div>
            </div>

            {/* DATOS DEL RANCHO */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 font-serif text-lg font-bold text-[#2E4A25]">
                <Home className="w-5 h-5" /> Datos del Rancho
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Nombre del Rancho</label>
                  <input type="text" name="rancho.nombre" value={formData.rancho?.nombre || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Municipio</label>
                  <input type="text" name="rancho.municipio" value={formData.rancho?.municipio || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Estado</label>
                  <input type="text" name="rancho.estado" value={formData.rancho?.estado || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Número de Cabezas</label>
                  <input type="number" name="rancho.cabezas" value={formData.rancho?.cabezas || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Capacidad de Animales</label>
                  <input type="number" name="rancho.capacidad" value={formData.rancho?.capacidad || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Hectáreas</label>
                  <input type="number" step="0.1" name="rancho.hectareas" value={formData.rancho?.hectareas || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs text-gray-500 font-medium">Dirección</label>
                  <input type="text" name="rancho.direccion" value={formData.rancho?.direccion || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Tipo de Rancho</label>
                  <input type="text" name="rancho.tipo" value={formData.rancho?.tipo || ''} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387030] outline-none text-gray-900 text-sm" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="bg-white p-6 border-t border-gray-100 flex items-center justify-center gap-4 shrink-0 font-sans">
          <button 
            type="button"
            onClick={onClose}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Cancelar
          </button>
          
          <button 
            type="submit"
            form="form-editar-perfil-comercial"
            disabled={isLoading}
            className="px-8 py-3 bg-[#B89B8D] text-white rounded-lg hover:bg-[#A3887B] text-sm font-semibold transition-colors shadow-sm disabled:opacity-70"
          >
            {isLoading ? 'Enviando...' : 'Enviar Cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}
