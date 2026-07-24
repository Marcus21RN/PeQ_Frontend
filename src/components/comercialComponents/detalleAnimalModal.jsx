/* eslint-disable react-hooks/set-state-in-effect */

// src/components/comercialComponents/detalleAnimalModal.jsx
import { useEffect, useState } from 'react';
import { X, Edit2, FileText, Calendar, MapPin, Heart, Book, User, Phone, Stethoscope, Clock, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export default function ModalDetalleAnimal({ isOpen, onClose, animalId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // useEffect(() => {
  //   if (!isOpen || !animalId) return;
  //   const fetchAnimal = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await api.get(`/comercial/animales/${animalId}`);
  //       setData(res.data);
  //     } catch (error) { console.error(error); } finally { setIsLoading(false); }
  //   };
  //   fetchAnimal();
  // }, [isOpen, animalId]);

  // DATOS SIMULADOS (MOCK DATA)
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData({
        id: 'POR-002',
        nombre: 'Yorkshire 002',
        raza: 'Yorkshire',
        sexo: 'Hembra',
        peso: '120 kg',
        edad: '1 años',
        proposito: 'Desarrollo',
        condicion: 'Bueno',
        produccion: 'Engorda',
        crias: 'No',
        origen: 'Granja San José, Michoacán',
        fechaRegistro: '8 de noviembre de 2025',
        precio: '8,500',
        estadoCertificacion: 'Certificado ✓',
        ultimaActualizacion: '14 de febrero de 2026',
        productor: {
          rancho: 'Granja San José',
          tipo: 'Comercial',
          propietario: 'Ana María López Hernández',
          contacto: '+52 44 4567 8901',
          ubicacion: 'Michoacán, México'
        },
        veterinario: {
          nombre: 'Dra. Ana Martínez',
          cedula: 'CED-VET-0974321',
          fechaCert: '13/02/2026',
          proximaRev: '13/05/2026'
        }
      });
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [isOpen, animalId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-[#F8F9FA] rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col font-serif shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera Oscura */}
        <div className="bg-[#3B2211] p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Sistema de Regulación y Control de Ganado</h2>
            <p className="text-yellow-600/90 text-sm font-sans">Verifica, confía y compra</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido (Grid de 2 columnas) */}
        <div className="overflow-y-auto p-6 flex-1 font-sans">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center text-gray-500">Cargando ficha técnica...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* COLUMNA IZQUIERDA (Info Principal) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Tarjeta 1: Info Básica */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 font-serif">{data.nombre}</h3>
                      <p className="text-gray-500 text-sm mt-1">{data.raza} · {data.sexo}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-[#A4B15C] text-white px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide">Bueno</span>
                      <button className="bg-[#5C743D] hover:bg-[#4A5D31] text-white p-2 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-6 mb-6">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div><p className="text-xs text-gray-500">No. de identificación</p><p className="font-bold text-gray-900">{data.id}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div><p className="text-xs text-gray-500">Peso</p><p className="font-bold text-gray-900">{data.peso}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div><p className="text-xs text-gray-500">Edad</p><p className="font-bold text-gray-900">{data.edad}</p></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6 border-b border-gray-100 pb-6 mb-6">
                    <div><p className="text-xs text-gray-500 mb-1">Propósito de Venta</p><span className="bg-[#B9C675] text-[#3B2211] px-3 py-1 rounded-md text-xs font-bold">{data.proposito}</span></div>
                    <div><p className="text-xs text-gray-500 mb-1">Condición</p><span className="bg-[#B9C675] text-[#3B2211] px-3 py-1 rounded-md text-xs font-bold">{data.condicion}</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-6">
                    <div className="flex gap-3"><MapPin className="w-5 h-5 text-[#5C743D]" /><div><p className="text-xs text-gray-500">Tipo de Producción</p><p className="font-medium text-[#5C743D]">{data.produccion}</p></div></div>
                    <div className="flex gap-3"><Heart className="w-5 h-5 text-green-500" /><div><p className="text-xs text-gray-500">Con Crías</p><p className="font-medium text-gray-900">{data.crias}</p></div></div>
                    <div className="flex gap-3"><MapPin className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Origen</p><p className="font-medium text-gray-900">{data.origen}</p></div></div>
                    <div className="flex gap-3"><Calendar className="w-5 h-5 text-gray-400" /><div><p className="text-xs text-gray-500">Fecha de Registro</p><p className="font-medium text-gray-900">{data.fechaRegistro}</p></div></div>
                  </div>
                </div>

                {/* Tarjeta 2: Certificaciones */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex gap-2 items-center mb-4 font-serif text-lg font-bold text-gray-900"><Book className="w-5 h-5 text-[#5C743D]" /> Certificaciones</div>
                  <div className="flex gap-2 mb-4">
                    <span className="bg-[#5C743D] text-white px-3 py-1 rounded-md text-sm">Activo</span>
                    <span className="bg-[#5C743D] text-white px-3 py-1 rounded-md text-sm">Certificación Sanitaria</span>
                  </div>
                  <button className="w-full py-3 bg-[#5C743D] hover:bg-[#4A5D31] text-white rounded-lg font-bold text-sm transition-colors">Libro de actas Permisos Oficiales</button>
                </div>

                {/* Tarjeta 3: Productor */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex gap-2 items-center mb-6 font-serif text-lg font-bold text-gray-900"><User className="w-5 h-5 text-[#5C743D]" /> Información del Productor</div>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div><p className="text-xs text-gray-500">Nombre del Rancho</p><p className="font-medium text-[#5C743D]">{data.productor.rancho}</p></div>
                    <div><p className="text-xs text-gray-500 mb-1">Tipo de Rancho</p><span className="bg-[#5C743D] text-white px-3 py-1 rounded-full text-xs">{data.productor.tipo}</span></div>
                    <div><p className="text-xs text-gray-500">Propietario</p><p className="font-medium text-gray-900">{data.productor.propietario}</p></div>
                    <div className="flex gap-2 items-center"><Phone className="w-4 h-4 text-gray-400"/><p className="font-medium text-gray-900">{data.productor.contacto}</p></div>
                    <div className="col-span-2"><p className="text-xs text-gray-500">Ubicación</p><p className="font-medium text-[#5C743D]">{data.productor.ubicacion}</p></div>
                  </div>
                </div>

                {/* Tarjeta 4: Veterinaria */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex gap-2 items-center mb-6 font-serif text-lg font-bold text-gray-900"><Stethoscope className="w-5 h-5 text-[#5C743D]" /> Certificación Veterinaria</div>
                  <div className="grid grid-cols-2 gap-y-6">
                    <div><p className="text-xs text-gray-500">Certificado por</p><p className="font-medium text-[#5C743D]">{data.veterinario.nombre}</p></div>
                    <div><p className="text-xs text-gray-500">Cédula Profesional</p><p className="font-medium text-gray-900">{data.veterinario.cedula}</p></div>
                    <div><p className="text-xs text-gray-500">Fecha de Certificación</p><p className="font-medium text-gray-900">{data.veterinario.fechaCert}</p></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-red-500"/><div><p className="text-xs text-gray-500">Próxima Revisión</p><p className="font-medium text-gray-900">{data.veterinario.proximaRev}</p></div></div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA (QR y Precio) */}
              <div className="space-y-6">
                
                {/* QR Code */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                  <h4 className="text-left font-serif font-bold text-gray-900 mb-4">Código QR</h4>
                  <div className="border-4 border-gray-100 rounded-2xl p-4 inline-block mb-4">
                    {/* Placeholder de QR */}
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=POR-002&color=3B2211" alt="QR Code" className="w-48 h-48 mx-auto" />
                  </div>
                  <p className="text-xs text-gray-500 px-4">Escanea para acceder a la ficha técnica certificada</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h5 className="font-bold text-gray-900 mb-2 font-serif text-sm">Información del QR</h5>
                    <p className="text-xs text-gray-600 mb-1">ID: {data.id}</p>
                    <p className="text-xs text-gray-600 mb-1">Animal: {data.nombre}</p>
                    <p className="text-xs text-gray-600 font-bold">Estado: {data.estadoCertificacion}</p>
                  </div>
                </div>

                {/* Precio y Galería */}
                <div className="bg-[#3B2211] rounded-xl shadow-lg p-6 text-center text-white">
                  <p className="text-xs text-yellow-600/80 font-bold tracking-widest uppercase mb-2">Precio de Venta</p>
                  <h3 className="text-4xl font-bold font-serif mb-1">$ {data.precio}</h3>
                  <p className="text-sm text-gray-400 mb-6">MXN</p>
                  <button className="w-full py-3 bg-[#5C743D] hover:bg-[#4A5D31] text-white rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Ver Galería de Imágenes
                  </button>
                </div>

                <div className="bg-[#FDF6E3] border border-[#F3E5AB] rounded-xl p-4 text-center">
                  <p className="text-sm text-[#3B2211]">Última actualización: <span className="font-bold">{data.ultimaActualizacion}</span></p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
