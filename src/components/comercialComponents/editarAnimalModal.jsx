/* eslint-disable react-hooks/set-state-in-effect */
// src/components/comercial/ModalEditarAnimal.jsx
import { useState, useEffect } from 'react';
import { X, Lock, Calendar, Factory, MapPin, Save } from 'lucide-react';

export default function ModalEditarAnimal({ isOpen, onClose, dataActual }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // useEffect(() => {
  //   if (!isOpen || !animalId) return;
  //   const fetchAnimal = async () => {
  //     try {
  //       const res = await api.get(`/comercial/animales/${animalId}`);
  //       setFormData(res.data);
  //     } catch (error) { console.error("Error cargando animal", error); }
  //   };
  //   fetchAnimal();
  // }, [isOpen, animalId]);
  //
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     await api.put(`/comercial/animales/${animalId}`, formData);
  //     onClose(); // Cerrar tras guardar exitosamente y recargar tabla
  //   } catch(error) {
  //     console.error('Error al actualizar', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  useEffect(() => {
    if (dataActual) {
      setFormData(dataActual);
    } else if (isOpen) {
      // Datos basados exactamente en tu captura de pantalla
      setFormData({
        id_display: 'A-001',
        nombre: 'Holstein 001',
        sexo: 'Hembra',
        edad: '3',
        peso: '520',
        condicion: 'Excelente',
        proposito: 'Producción',
        tipo_produccion: 'Leche',
        lote: 'Lote A',
        origen: 'Granja San José, Michoacán',
        // Campos bloqueados
        tipo: 'Bovino',
        raza: 'Holstein'
      });
    }
  }, [dataActual, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Simulando envío de actualización...", formData);
    
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera Oscura */}
        <div className="bg-[#3e2723] p-5 flex items-start justify-between shrink-0 text-white">
          <div>
            <h2 className="text-xl font-bold font-serif tracking-wide">Editar Animal</h2>
            <p className="text-gray-300 text-sm mt-1">{formData.id_display} - {formData.raza}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          
          {/* Alerta de Campos Bloqueados */}
          <div className="bg-[#FFFDF0] border border-[#FDE68A] p-4 rounded-xl flex items-start gap-3 mb-8">
            <Lock className="w-5 h-5 text-[#92400E] mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-[#92400E] font-serif">Campos bloqueados</h3>
              <p className="text-sm text-[#92400E] mt-1">
                El <strong>tipo</strong> y la <strong>raza</strong> del animal no pueden ser modificados. Todos los cambios requieren aprobación del administrador.
              </p>
            </div>
          </div>

          <form id="form-editar-animal" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              {/* Nombre del Animal */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2723] font-serif">Nombre del Animal</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={formData.nombre || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2723] font-serif">Sexo</label>
                <select 
                  name="sexo"
                  value={formData.sexo || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900 bg-white"
                >
                  <option value="Hembra">Hembra</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>

              {/* Edad */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#3e2723] font-serif">
                  <Calendar className="w-4 h-4 text-[#3e2723]" /> Edad (años)
                </label>
                <input 
                  type="number" 
                  name="edad"
                  step="0.1"
                  value={formData.edad || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2723] font-serif">Peso (kg)</label>
                <input 
                  type="number" 
                  name="peso"
                  value={formData.peso || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>

              {/* Condición */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2723] font-serif">Condición</label>
                <select 
                  name="condicion"
                  value={formData.condicion || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900 bg-white"
                >
                  <option value="Malo">Malo</option>
                  <option value="Regular">Regular</option>
                  <option value="Bueno">Bueno</option>
                  <option value="Excelente">Excelente</option>
                </select>
              </div>

              {/* Propósito de Venta */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2723] font-serif">Propósito de Venta</label>
                <input 
                  type="text" 
                  name="proposito"
                  value={formData.proposito || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>

              {/* Tipo de Producción */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#3e2723] font-serif">
                  <Factory className="w-4 h-4 text-[#3e2723]" /> Tipo de Producción
                </label>
                <input 
                  type="text" 
                  name="tipo_produccion"
                  value={formData.tipo_produccion || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>

              {/* Lote */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#3e2723] font-serif">Lote</label>
                <input 
                  type="text" 
                  name="lote"
                  value={formData.lote || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>

              {/* Origen (Full width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-bold text-[#3e2723] font-serif">
                  <MapPin className="w-4 h-4 text-[#3e2723]" /> Origen
                </label>
                <input 
                  type="text" 
                  name="origen"
                  value={formData.origen || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3e2723] outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Zona de Campos Bloqueados (Gris) */}
            <div className="bg-[#F9F9F9] border border-gray-200 rounded-xl p-5 mt-8">
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Campos bloqueados (no se pueden modificar)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tipo</p>
                  <p className="font-bold text-[#3e2723] font-serif">{formData.tipo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Raza</p>
                  <p className="font-bold text-[#3e2723] font-serif">{formData.raza}</p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer (Botones de Acción) */}
        <div className="p-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 shrink-0 bg-white">
          <button 
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors"
          >
            Cancelar
          </button>
          
          <button 
            type="submit"
            form="form-editar-animal"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-[#387030] hover:bg-[#2c5726] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

      </div>
    </div>
  );
}
