/* eslint-disable no-unused-vars */

// src/pages/comercial/RegistrarAnimal.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Upload, Check } from 'lucide-react';

// Componente reutilizable para las etiquetas con el punto verde de "Requerido"
function LabelRequerido({ texto }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#3B2211] font-medium mb-2 font-sans">
      <span className="w-2 h-2 rounded-full bg-[#5C743D]"></span>
      {texto} *
    </label>
  );
}

export default function RegistrarAnimal() {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estado inicial del formulario
  const initialFormState = {
    tipoAnimal: '',
    identificacion: '',
    raza: '',
    sexo: '',
    edad: '',
    peso: '',
    condicionCorporal: '',
    color: '',
    estadoSalud: '',
    proposito: '',
    conCrias: 'No', // Valor por defecto
    numeroCrias: '', // Se habilita si conCrias === 'Sí'
    observaciones: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [catalogos, setCatalogos] = useState({});
  // useEffect(() => {
  //   const fetchCatalogos = async () => {
  //     try {
  //       const res = await api.get('/catalogos/animales');
  //       setCatalogos(res.data);
  //     } catch (error) { console.error(error); }
  //   };
  //   fetchCatalogos();
  // }, []);
  //
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     // Formatear datos, por ejemplo si hay archivos adjuntos se debe usar FormData real (multipart/form-data)
  //     await api.post('/comercial/animales/registrar', formData);
  //     setIsSuccessModalOpen(true);
  //   } catch(error) {
  //     console.error('Error guardando', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA) PARA LOS SELECTS
  // ==========================================
  const mockCatalogos = {
    tipos: ['Bovino', 'Porcino', 'Ovino', 'Caprino', 'Equino', 'Avícola'],
    razas: ['Angus', 'Holstein', 'Jersey', 'Charolais', 'Duroc', 'Merino'], 
    sexos: ['Macho', 'Hembra'],
    condiciones: ['Malo', 'Regular', 'Bueno', 'Excelente'],
    estadosSalud: ['Sano', 'Enfermo', 'En Tratamiento', 'En Observación'],
    propositos: ['Engorda', 'Producción Lechera', 'Cría', 'Doble Propósito', 'Desarrollo']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Si el usuario cambia a "No", limpiamos el número de crías automáticamente
      ...(name === 'conCrias' && value === 'No' ? { numeroCrias: '' } : {})
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Simulando envío a la BD...", formData);
    
    // Simulamos el tiempo de respuesta del servidor
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccessModalOpen(true); // Abrimos nuestro modal de éxito UX
    }, 800);
  };

  const handleRegistrarOtro = () => {
    setFormData(initialFormState); // Limpiamos todos los campos
    setIsSuccessModalOpen(false); // Cerramos el modal
    window.scrollTo(0, 0); // Llevamos al usuario arriba
  };  

  return (
    <div className="min-h-screen bg-[#FDFDFB] font-serif pb-16">

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-12">
          
          {/* Encabezado del Formulario */}
          <div className="mb-10 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-[#3B2211]">Registrar Nuevo Animal</h1>
            <p className="text-gray-500 mt-2 font-sans">Completa la información del animal para su registro en el sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 font-sans">
            
            {/* SECCIÓN 1: Información Básica */}
            <section>
              <h2 className="text-xl font-bold text-[#3B2211] font-serif mb-6">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LabelRequerido texto="Tipo de Animal" />
                  <select name="tipoAnimal" value={formData.tipoAnimal} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700 bg-white">
                    <option value="">Seleccionar tipo...</option>
                    {mockCatalogos.tipos.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                  </select>
                </div>
                <div>
                  <LabelRequerido texto="Identificación/Arete" />
                  <input type="text" name="identificacion" value={formData.identificacion} onChange={handleInputChange} required placeholder="A-001" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700" />
                </div>
                <div>
                  <LabelRequerido texto="Raza" />
                  <select name="raza" value={formData.raza} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700 bg-[#F9FAFB]">
                    <option value="">Seleccionar raza...</option>
                    {mockCatalogos.razas.map(raza => <option key={raza} value={raza}>{raza}</option>)}
                  </select>
                </div>
                <div>
                  <LabelRequerido texto="Sexo" />
                  <select name="sexo" value={formData.sexo} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700 bg-white">
                    <option value="">Seleccionar sexo...</option>
                    {mockCatalogos.sexos.map(sexo => <option key={sexo} value={sexo}>{sexo}</option>)}
                  </select>
                </div>
                <div>
                  <LabelRequerido texto="Edad (Años)" />
                  <input type="number" step="0.1" name="edad" value={formData.edad} onChange={handleInputChange} required placeholder="2.5" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700" />
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: Datos Físicos */}
            <section>
              <h2 className="text-xl font-bold text-[#3B2211] font-serif mb-6">Datos Físicos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LabelRequerido texto="Peso Estimado (kg)" />
                  <input type="number" name="peso" value={formData.peso} onChange={handleInputChange} required placeholder="450" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700" />
                  <p className="text-[10px] text-gray-400 mt-1">El peso será validado por el veterinario</p>
                </div>
                <div>
                  <LabelRequerido texto="Condición Corporal" />
                  <select name="condicionCorporal" value={formData.condicionCorporal} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700 bg-white">
                    <option value="">Seleccionar...</option>
                    {mockCatalogos.condiciones.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                  </select>
                </div>
                <div>
                  <LabelRequerido texto="Color/Pelaje" />
                  <input type="text" name="color" value={formData.color} onChange={handleInputChange} required placeholder="Negro con blanco" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700" />
                </div>
                <div>
                  <LabelRequerido texto="Estado de Salud" />
                  <select name="estadoSalud" value={formData.estadoSalud} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700 bg-white">
                    <option value="">Seleccionar...</option>
                    {mockCatalogos.estadosSalud.map(est => <option key={est} value={est}>{est}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: Tipo de Producción y Lógica de Crías */}
            <section>
              <h2 className="text-xl font-bold text-[#3B2211] font-serif mb-6">Tipo de Producción</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <LabelRequerido texto="Propósito" />
                  <select name="proposito" value={formData.proposito} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700 bg-white">
                    <option value="">Seleccionar...</option>
                    {mockCatalogos.propositos.map(prop => <option key={prop} value={prop}>{prop}</option>)}
                  </select>
                </div>
                
                <div>
                  <LabelRequerido texto="¿Cuenta con crías?" />
                  <div className="flex gap-6 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="conCrias" value="Sí" checked={formData.conCrias === 'Sí'} onChange={handleInputChange} className="w-4 h-4 text-[#5C743D] focus:ring-[#5C743D]" />
                      <span className="text-gray-700">Sí</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="conCrias" value="No" checked={formData.conCrias === 'No'} onChange={handleInputChange} className="w-4 h-4 text-[#5C743D] focus:ring-[#5C743D]" />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* Aparece mágicamente si selecciona "Sí" */}
                {formData.conCrias === 'Sí' && (
                  <div className="md:col-start-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="flex items-center gap-2 text-sm text-[#3B2211] font-medium mb-2 font-sans">
                      Número de crías *
                    </label>
                    <input type="number" name="numeroCrias" value={formData.numeroCrias} onChange={handleInputChange} required placeholder="Ej: 2" min="1" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5C743D] outline-none text-gray-700" />
                  </div>
                )}
              </div>
            </section>

            {/* SECCIÓN 4: Documentación y Fotos (Diseño con dashed borders) */}
            <section>
              <h2 className="text-xl font-bold text-[#3B2211] font-serif mb-6">Documentación y Fotografías</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Zona Foto Frontal */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm font-bold text-gray-700 mb-1">Fotografía Frontal *</p>
                  <p className="text-xs text-gray-400 mb-3">Vista completa del animal</p>
                  <span className="text-sm text-[#A4B15C] font-semibold">Seleccionar imagen</span>
                  <input type="file" className="hidden" accept="image/*" />
                </div>

                {/* Zona Foto Lateral */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm font-bold text-gray-700 mb-1">Fotografía Lateral *</p>
                  <p className="text-xs text-gray-400 mb-3">Vista de perfil</p>
                  <span className="text-sm text-[#A4B15C] font-semibold">Seleccionar imagen</span>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              {/* Zona Documentos */}
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-sm font-bold text-gray-700 mb-1">Documentos Adicionales</p>
                <p className="text-xs text-gray-400 mb-3">Certificados de vacunación, pedigree, etc. (Opcional)</p>
                <span className="text-sm text-[#A4B15C] font-semibold">Seleccionar archivos</span>
                <input type="file" className="hidden" multiple accept=".pdf,.jpg,.png" />
              </div>
            </section>

            {/* SECCIÓN 5: Observaciones */}
            <section>
              <h2 className="text-xl font-bold text-[#3B2211] font-serif mb-4">Observaciones Adicionales</h2>
              <textarea 
                name="observaciones" 
                value={formData.observaciones} 
                onChange={handleInputChange} 
                rows="5" 
                placeholder="Agrega cualquier información adicional relevante sobre el animal..." 
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#5C743D] outline-none text-sm text-gray-700 resize-none"
              ></textarea>
            </section>

            {/* Botones de Acción */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <Link to="/comercial/dashboard" className="flex-1 py-4 border border-gray-300 rounded-xl text-center font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </Link>
              <button disabled={isLoading} type="submit" className="flex-1 py-4 bg-[#5C743D] text-white rounded-xl font-bold hover:bg-[#4A5D31] transition-colors disabled:bg-[#5C743D]/70 shadow-sm">
                {isLoading ? 'Guardando registro...' : 'Registrar Animal'}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL UX DE ÉXITO (Reemplaza a la pantalla 2) */}
      {/* ========================================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#FDFDFB] rounded-3xl w-full max-w-lg p-10 text-center shadow-2xl font-serif">
            
            {/* Ícono animado de éxito */}
            <div className="w-24 h-24 bg-[#F0F4EC] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-[#5C743D]" />
            </div>

            <h2 className="text-3xl font-bold text-[#3B2211] mb-4">Animal Registrado Exitosamente</h2>
            
            <p className="text-gray-600 font-sans mb-10 text-sm leading-relaxed">
              El animal ha sido registrado en el sistema. Ahora puedes solicitar su certificación desde el panel "Mis Animales".
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-sans">
              <button 
                onClick={handleRegistrarOtro}
                className="flex-1 py-3.5 border-2 border-[#5C743D] text-[#5C743D] rounded-xl font-bold hover:bg-[#F0F4EC] transition-colors"
              >
                Registrar Otro
              </button>
              
              <button 
                onClick={() => navigate('/comercial/animales')}
                className="flex-1 py-3.5 bg-[#5C743D] text-white rounded-xl font-bold hover:bg-[#4A5D31] transition-colors shadow-md"
              >
                Ver Mis Animales
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
