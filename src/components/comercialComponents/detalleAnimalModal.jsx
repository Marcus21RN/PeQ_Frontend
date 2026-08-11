/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { 
  X, Edit3, Scale, Calendar, Heart, 
  MapPin, User, Phone, ShieldCheck, 
  FileText, Syringe, Image as ImageIcon 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getFichaTecnicaAnimal } from '../../services/apiTraspatio/fichaTecnica';
import { getFichaTecnicaAnimalComer } from '../../services/apiComercial/fichaTecnica';

export default function ModalDetalleAnimal({ isOpen, onClose, animalId }) {
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !animalId) return;

    let isMounted = true;

    const fetchFichaFallback = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Intento principal: API Comercial
        const dataComer = await getFichaTecnicaAnimalComer(animalId);
        if (isMounted) {
          setFicha(dataComer);
          setLoading(false);
          return;
        }
      } catch (errComer) {
        console.warn('Falló endpoint comercial, intentando traspatio:', errComer);
      }

      try {
        // 2. Intento de respaldo: API Traspatio
        const dataTraspatio = await getFichaTecnicaAnimal(animalId);
        if (isMounted) {
          setFicha(dataTraspatio);
          setLoading(false);
          return;
        }
      } catch (errTras) {
        console.error('Error al cargar la ficha técnica en ambos servicios:', errTras);
        if (isMounted) {
          setError('No se pudo obtener la ficha técnica del animal.');
          setLoading(false);
        }
      }
    };

    fetchFichaFallback();

    return () => {
      isMounted = false;
    };
  }, [isOpen, animalId]);

  if (!isOpen) return null;

  // Formateador de fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 md:p-4 font-sans backdrop-blur-xs">
      <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* ENCABEZADO PRINCIPAL (CAFÉ OBSCURO) */}
        <div className="flex items-center justify-between bg-[#2C1405] px-8 py-5 text-white">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wide">Sistema de Regulación y Control de Ganado</h2>
            <p className="font-sans text-xs text-amber-100/80">Verifica, confía y compra</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="overflow-y-auto p-6 md:p-8">
          {loading ? (
            <div className="py-20 text-center font-serif text-gray-500">Cargando ficha técnica...</div>
          ) : error || !ficha ? (
            <div className="py-20 text-center font-serif text-red-600">{error || 'No hay datos disponibles.'}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              
              {/* COLUMNA IZQUIERDA (INFORMACIÓN GENERAL Y CERTIFICACIONES) */}
              <div className="space-y-6 lg:col-span-8">
                
                {/* 1. Tarjeta Datos Base */}
                <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="font-serif text-2xl font-bold text-[#2C1405]">
                        {ficha.raza} {ficha.no_identificacion ? ficha.no_identificacion.slice(-3) : '001'}
                      </h1>
                      <p className="text-sm font-medium text-gray-400">
                        {ficha.raza} · {ficha.sexo === 'H' || ficha.sexo?.toLowerCase().includes('hem') ? 'Hembra' : 'Macho'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-[#A0B050] px-4 py-1.5 font-serif text-sm font-semibold text-white">
                        {ficha.condicion_general || 'Bueno'}
                      </span>
                      <button className="rounded-lg bg-[#5B6E38] p-2 text-white transition-colors hover:bg-[#48582C]">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 border-b border-gray-100 pb-6 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">No. de identificación</p>
                      <p className="font-serif text-base font-bold text-[#2C1405]">{ficha.no_identificacion}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Peso</p>
                      <p className="font-serif text-base font-bold text-[#2C1405]">{ficha.peso_kg} kg</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Edad</p>
                      <p className="font-serif text-base font-bold text-[#2C1405]">{ficha.edad} años</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Propósito de Venta</p>
                      <span className="mt-1 inline-block rounded-lg bg-[#A0B050] px-3 py-1 text-xs font-semibold text-white">
                        {ficha.proposito_produccion || 'Desarrollo'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Condición</p>
                      <span className="mt-1 inline-block rounded-lg bg-[#A0B050] px-3 py-1 text-xs font-semibold text-white">
                        {ficha.condicion_general || 'Bueno'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Tipo de Producción</p>
                      <p className="font-serif font-bold text-[#2C1405]">Engorda</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Con Crías</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.tiene_crias ? 'Sí' : 'No'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Origen</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.nombre_rancho}, {ficha.ubicacion_origen || 'Tijuana'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Fecha de Registro</p>
                      <p className="font-serif font-bold text-[#2C1405]">{formatDate(ficha.fecha_registro)}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Tarjeta Certificaciones */}
                <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                  <h3 className="font-serif text-lg font-bold text-[#2C1405]">Certificaciones</h3>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-lg bg-[#5B6E38] px-3 py-1 text-xs font-semibold text-white">Activo</span>
                    <span className="rounded-lg bg-[#5B6E38] px-3 py-1 text-xs font-semibold text-white">Certificación Sanitaria</span>
                  </div>
                  <div className="mt-4 rounded-xl bg-[#5B6E38] py-3 text-center text-sm font-semibold text-white">
                    Libro de actas Permisos Oficiales
                  </div>
                </div>

                {/* 3. Tarjeta Información del Productor */}
                <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                  <h3 className="font-serif text-lg font-bold text-[#2C1405]">Información del Productor</h3>
                  <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Nombre del Rancho</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.nombre_rancho}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Tipo de Rancho</p>
                      <span className="mt-1 inline-block rounded-lg bg-[#5B6E38] px-3 py-0.5 text-xs font-semibold text-white">
                        {ficha.tipo_rancho || 'Comercial'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Propietario</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.propietario}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Contacto</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.contacto_propietario || 'No registrado'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-gray-400">Ubicación</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.ubicacion_origen || 'Baja California, México'}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Tarjeta Certificación Veterinaria */}
                <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                  <h3 className="font-serif text-lg font-bold text-[#2C1405]">Certificación Veterinaria</h3>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-lg bg-[#5B6E38] px-3 py-1 text-xs font-semibold text-white">Activo</span>
                    <span className="rounded-lg bg-[#5B6E38] px-3 py-1 text-xs font-semibold text-white">Certificación Sanitaria</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Certificado por</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.certificado_por || 'Dra. Ana Martínez'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Cédula Profesional</p>
                      <p className="font-serif font-bold text-[#2C1405]">{ficha.cedula_profesional || 'CED-VET-0974321'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Fecha de Certificación</p>
                      <p className="font-serif font-bold text-[#2C1405]">{formatDate(ficha.fecha_certificacion)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Próxima Revisión</p>
                      <p className="font-serif font-bold text-red-600">{formatDate(ficha.proxima_revision_sugerida)}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Historial de Vacunación */}
                <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#2C1405]">Historial de Vacunación</h3>
                    <button className="rounded-xl border border-[#5B6E38] px-4 py-1.5 font-sans text-xs font-semibold text-[#5B6E38] transition-colors hover:bg-[#5B6E38] hover:text-white">
                      Ver Historial Completo
                    </button>
                  </div>
                  <p className="mt-2 text-xs font-medium text-gray-400">
                    {ficha.enfermedades?.length || 0} vacunación(es) registrada(s)
                  </p>
                  <div className="mt-4">
                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                      Pases Previos
                    </span>
                  </div>
                </div>

              </div>

              {/* COLUMNA DERECHA (CÓDIGO QR, PRECIO Y FOOTER) */}
              <div className="space-y-6 lg:col-span-4">
                
                {/* Tarjeta Código QR Dinámico */}
                <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 text-center shadow-2xs">
                  <h3 className="text-left font-serif text-base font-bold text-[#2C1405]">Código QR</h3>
                  
                  <div className="my-4 flex justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-2xs">
                    <QRCodeSVG 
                      value={JSON.stringify({
                        id: ficha.no_identificacion,
                        animal: `${ficha.raza} ${ficha.no_identificacion ? ficha.no_identificacion.slice(-3) : ''}`,
                        estado: 'Certificado ✓',
                        propietario: ficha.propietario,
                        rancho: ficha.nombre_rancho
                      })} 
                      size={200}
                      fgColor="#2C1405"
                      level="H"
                    />
                  </div>

                  <p className="text-xs text-gray-400">Escanea para acceder a la ficha técnica certificada</p>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs space-y-1">
                    <p className="font-serif font-bold text-[#2C1405]">Información del QR</p>
                    <p className="text-gray-500">ID: <span className="font-semibold text-gray-700">{ficha.no_identificacion}</span></p>
                    <p className="text-gray-500">Animal: <span className="font-semibold text-gray-700">{ficha.raza}</span></p>
                    <p className="text-gray-500">Estado: <span className="font-semibold text-[#5B6E38]">Certificado ✓</span></p>
                  </div>
                </div>

                {/* Tarjeta Precio de Venta */}
                <div className="rounded-2xl bg-[#2C1405] p-6 text-center text-white shadow-md">
                  <p className="text-xs font-bold tracking-wider uppercase text-amber-100/70">PRECIO DE VENTA</p>
                  <p className="my-2 font-serif text-4xl font-bold tracking-tight">
                    ${ficha.precio_venta ? Number(ficha.precio_venta).toLocaleString('es-MX') : '0'}
                  </p>
                  <p className="text-xs font-semibold text-amber-100/50">MXN</p>

                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B6E38] py-3 text-sm font-bold text-white transition-colors hover:bg-[#48582C]">
                    <ImageIcon className="h-4 w-4" /> Ver Galería de Imágenes
                  </button>
                </div>

                {/* Última actualización */}
                <div className="rounded-xl bg-[#F5F2DF] py-3.5 text-center text-xs font-semibold text-[#2C1405]">
                  Última actualización: {formatDate(ficha.fecha_registro)}
                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}