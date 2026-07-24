/* eslint-disable react-hooks/set-state-in-effect */
// src/components/admin/ModalEditarPerfil.jsx
import { useState, useEffect } from 'react';
import { X, User, Shield, Lock, TriangleAlert } from 'lucide-react';

export default function ModalEditarPerfil({ isOpen, onClose, dataActual }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (dataActual) {
      setFormData(dataActual);
    } else {
      // Datos simulados por defecto (Mock Data) si no se pasan por props
      setFormData({
        nombre: 'Carlos Alberto Reyes',
        curp: 'REAC900520HDFYRL04',
        correo: 'admin@sistema-ganado.gob.mx',
        telefono: '5559001234',
        rol_sistema: 'Administrador General',
        miembro_desde: 'enero de 2023',
        ultimo_acceso: '12 de marzo de 2026',
        departamento: 'Regulación Pecuaria',
        municipio: 'Guadalajara',
        estado_geo: 'Jalisco',
        fecha_registro: '14 de enero de 2023'
      });
    }
  }, [dataActual, isOpen]);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await api.post('/admin/perfil/solicitar-cambio', formData);
  //     // Lógica para mostrar mensaje de éxito y cerrar el modal
  //     onClose(); 
  //   } catch (err) {
  //     console.error('Error al enviar la solicitud de cambio', err);
  //   }
  // };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Simulando envío de cambios a revisión...", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#F8F9FA] rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col font-serif shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="bg-white p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
            <p className="text-gray-500 mt-1 font-sans text-sm">Realiza modificaciones a tu información de administrador</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cuerpo Scrolleable del Formulario */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1">
          
          {/* Alerta de Aprobación */}
          <div className="bg-[#FFF9E6] border border-[#FDE68A] p-4 rounded-xl flex items-start gap-3">
            <TriangleAlert className="w-5 h-5 text-[#D97706] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#92400E] font-sans">Los cambios requieren aprobación</h3>
              <p className="text-sm text-[#92400E] font-sans mt-1">
                Incluso como administrador, las modificaciones a tu información personal deben ser aprobadas por otro administrador para mantener la integridad del sistema. Solo el cambio de contraseña es inmediato.
              </p>
            </div>
          </div>

          {/* Tarjetas Superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 mb-2 font-serif">Rol del Sistema</p>
              <p className="text-base font-bold text-gray-900 font-serif">{formData.rol_sistema}</p>
            </div>
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 mb-2 font-serif">Miembro Desde</p>
              <p className="text-base font-bold text-gray-900 font-serif">{formData.miembro_desde}</p>
            </div>
            <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
              <p className="text-xs text-gray-500 mb-2 font-serif">Último Acceso</p>
              <p className="text-base font-bold text-gray-900 font-serif">{formData.ultimo_acceso}</p>
            </div>
          </div>

          {/* Formulario de Edición */}
          <form id="form-editar-perfil" onSubmit={handleSubmit} className="space-y-6 font-sans">
            
            {/* SECCIÓN 1: Datos Personales */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 font-serif bg-white">
                <User className="w-5 h-5 text-[#5A3B2A]" />
                <h3 className="text-lg font-bold text-gray-900">Datos Personales</h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A3B2A] outline-none text-sm text-gray-900" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    CURP <Lock className="w-3 h-3"/> No editable
                  </label>
                  <p className="text-sm font-medium text-gray-900 py-3">{formData.curp}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="correo" 
                    value={formData.correo || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A3B2A] outline-none text-sm text-gray-900" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Teléfono</label>
                  <input 
                    type="text" 
                    name="telefono" 
                    value={formData.telefono || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A3B2A] outline-none text-sm text-gray-900" 
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Información Administrativa */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 font-serif bg-white">
                <Shield className="w-5 h-5 text-[#5A3B2A]" />
                <h3 className="text-lg font-bold text-gray-900">Información Administrativa</h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    Rol <Lock className="w-3 h-3"/> No editable
                  </label>
                  <div className="flex items-center gap-2 py-2">
                    <p className="text-sm font-medium text-gray-900">{formData.rol_sistema}</p>
                    <span className="bg-[#FDF0D5] text-[#8B6E00] px-2 py-0.5 rounded-full text-xs font-medium">Activo</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Departamento</label>
                  <input 
                    type="text" 
                    name="departamento" 
                    value={formData.departamento || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A3B2A] outline-none text-sm text-gray-900" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Municipio</label>
                  <input 
                    type="text" 
                    name="municipio" 
                    value={formData.municipio || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A3B2A] outline-none text-sm text-gray-900" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-medium">Estado</label>
                  <input 
                    type="text" 
                    name="estado_geo" 
                    value={formData.estado_geo || ''} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A3B2A] outline-none text-sm text-gray-900" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    Fecha de Registro <Lock className="w-3 h-3"/> No editable
                  </label>
                  <p className="text-sm font-medium text-gray-900 py-3">{formData.fecha_registro}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                    Último Acceso <Lock className="w-3 h-3"/> No editable
                  </label>
                  <p className="text-sm font-medium text-gray-900 py-3">{formData.ultimo_acceso}</p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer del Modal (Botones) */}
        <div className="bg-white p-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-4 font-sans shrink-0">

          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>

          <button 
            type="submit"
            form="form-editar-perfil"
            className="px-8 py-2.5 bg-[#B89B8D] text-white rounded-lg hover:bg-[#A3887B] text-sm font-medium transition-colors flex items-center justify-center shadow-sm"
          >
            Enviar Cambios
          </button>

        </div>
      </div>
    </div>
  );
}
