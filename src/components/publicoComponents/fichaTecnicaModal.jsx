import {
  X,
  Edit3,
  Scale,
  Calendar,
  Heart,
  MapPin,
  User,
  Phone,
  ShieldCheck,
  FileText,
  Syringe,
  Image as ImageIcon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const normalizeAnimal = (animal = {}) => {
  const base = animal?.datos_base ?? animal;

  return {
    no_identificacion: base.no_identificacion ?? base.arete_id ?? base.identificacion ?? base.codigo ?? '',
    raza: base.raza ?? base.raza_animal ?? base.nombre_raza ?? '',
    categoria: base.categoria ?? base.nombre_categoria ?? base.tipo_animal ?? '',
    sexo: base.sexo ?? base.genero ?? '',
    edad: base.edad ?? base.edad_anios ?? base.edad_meses ?? 0,
    peso_kg: base.peso_kg ?? base.peso ?? 0,
    condicion_general: base.condicion_general ?? base.condicion ?? '',
    proposito_produccion: base.proposito_produccion ?? base.proposito ?? '',
    tiene_crias: base.tiene_crias ?? base.crias ?? false,
    fecha_registro: base.fecha_registro ?? base.fecha_creacion ?? null,
    notas_adicionales: base.notas_adicionales ?? base.notas ?? '',
    precio_venta: base.precio_venta ?? base.precio ?? null,
    nombre_rancho: base.nombre_rancho ?? base.rancho ?? '',
    tipo_rancho: base.tipo_rancho ?? base.tipo_rancho_nombre ?? '',
    propietario: base.propietario ?? base.nombre_propietario ?? '',
    contacto_propietario: base.contacto_propietario ?? base.telefono ?? '',
    ubicacion_origen: base.ubicacion_origen ?? base.ubicacion ?? '',
    certificado_por: base.certificado_por ?? base.veterinario ?? '',
    cedula_profesional: base.cedula_profesional ?? base.cedula ?? '',
    fecha_certificacion: base.fecha_certificacion ?? base.fecha_cerificacion ?? null,
    proxima_revision_sugerida: base.proxima_revision_sugerida ?? base.proxima_revision ?? null,
    historial_medico: Array.isArray(base.historial_medico)
      ? base.historial_medico
      : Array.isArray(animal.historial_medico)
        ? animal.historial_medico
        : [],
  };
};

const moneyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getSexoLabel = (sexo) => {
  if (!sexo) return 'Macho';
  const value = String(sexo).toLowerCase();
  if (value.includes('hembra') || value.includes('f')) return 'Hembra';
  return 'Macho';
};


export default function FichaTecnicaPublicoModal({ isOpen, onClose, animal = {} }) {
  if (!isOpen) return null;

  const data = normalizeAnimal(animal);
  const qrValue = JSON.stringify({
    id: data.no_identificacion,
    animal: `${data.raza} ${data.no_identificacion ? data.no_identificacion.slice(-3) : ''}`,
    estado: 'Certificado ✓',
    propietario: data.propietario,
    rancho: data.nombre_rancho,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 md:p-4 font-sans backdrop-blur-xs">
      <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#2C1405] px-8 py-5 text-white">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wide">Sistema de Regulación y Control de Ganado</h2>
            <p className="font-sans text-xs text-amber-100/80">Verifica, confía y compra</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-serif text-2xl font-bold text-[#2C1405]">
                      {data.raza || 'Sin raza'} {data.no_identificacion ? data.no_identificacion.slice(-3) : '001'}
                    </h1>
                    <p className="text-sm font-medium text-gray-400">
                      {data.raza || 'Sin raza'} · {getSexoLabel(data.sexo)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-[#A0B050] px-4 py-1.5 font-serif text-sm font-semibold text-white">
                      {data.condicion_general || 'Bueno'}
                    </span>
                    <button className="rounded-lg bg-[#5B6E38] p-2 text-white transition-colors hover:bg-[#48582C]">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-b border-gray-100 pb-6 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">No. de identificación</p>
                    <p className="font-serif text-base font-bold text-[#2C1405]">{data.no_identificacion || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Peso</p>
                    <p className="font-serif text-base font-bold text-[#2C1405]">{data.peso_kg || 0} kg</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Edad</p>
                    <p className="font-serif text-base font-bold text-[#2C1405]">{data.edad || 0} años</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Propósito de Venta</p>
                    <span className="mt-1 inline-block rounded-lg bg-[#A0B050] px-3 py-1 text-xs font-semibold text-white">
                      {data.proposito_produccion || 'Desarrollo'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Condición</p>
                    <span className="mt-1 inline-block rounded-lg bg-[#A0B050] px-3 py-1 text-xs font-semibold text-white">
                      {data.condicion_general || 'Bueno'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 py-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Tipo de Producción</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.tipo_rancho || 'Engorda'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Con Crías</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.tiene_crias ? 'Sí' : 'No'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Origen</p>
                    <p className="font-serif font-bold text-[#2C1405]">
                      {data.nombre_rancho || 'Sin rancho'}, {data.ubicacion_origen || 'Sin ubicación'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Fecha de Registro</p>
                    <p className="font-serif font-bold text-[#2C1405]">{formatDate(data.fecha_registro)}</p>
                  </div>
                </div>
              </div>

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

              <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                <h3 className="font-serif text-lg font-bold text-[#2C1405]">Información del Productor</h3>
                <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Nombre del Rancho</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.nombre_rancho || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Tipo de Rancho</p>
                    <span className="mt-1 inline-block rounded-lg bg-[#5B6E38] px-3 py-0.5 text-xs font-semibold text-white">
                      {data.tipo_rancho || 'Comercial'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Propietario</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.propietario || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Contacto</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.contacto_propietario || 'No registrado'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-400">Ubicación</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.ubicacion_origen || 'Sin ubicación'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                <h3 className="font-serif text-lg font-bold text-[#2C1405]">Certificación Veterinaria</h3>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-lg bg-[#5B6E38] px-3 py-1 text-xs font-semibold text-white">Activo</span>
                  <span className="rounded-lg bg-[#5B6E38] px-3 py-1 text-xs font-semibold text-white">Certificación Sanitaria</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Certificado por</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.certificado_por || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Cédula Profesional</p>
                    <p className="font-serif font-bold text-[#2C1405]">{data.cedula_profesional || 'Sin información'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Fecha de Certificación</p>
                    <p className="font-serif font-bold text-[#2C1405]">{formatDate(data.fecha_certificacion)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Próxima Revisión</p>
                    <p className="font-serif font-bold text-red-600">{formatDate(data.proxima_revision_sugerida)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#2C1405]">Historial de Vacunación</h3>
                  <button className="rounded-xl border border-[#5B6E38] px-4 py-1.5 font-sans text-xs font-semibold text-[#5B6E38] transition-colors hover:bg-[#5B6E38] hover:text-white">
                    Ver Historial Completo
                  </button>
                </div>
                <p className="mt-2 text-xs font-medium text-gray-400">
                  {data.historial_medico?.length || 0} vacunación(es) registrada(s)
                </p>
                <div className="mt-4">
                  <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                    Pases Previos
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-2xl border border-gray-200/80 bg-[#FCFCF9] p-6 text-center shadow-2xs">
                <h3 className="text-left font-serif text-base font-bold text-[#2C1405]">Código QR</h3>

                <div className="my-4 flex justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-2xs">
                  <QRCodeSVG
                    value={qrValue}
                    size={200}
                    fgColor="#2C1405"
                    level="H"
                  />
                </div>

                <p className="text-xs text-gray-400">Escanea para acceder a la ficha técnica certificada</p>

                <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-left text-xs">
                  <p className="font-serif font-bold text-[#2C1405]">Información del QR</p>
                  <p className="text-gray-500">ID: <span className="font-semibold text-gray-700">{data.no_identificacion || 'Sin información'}</span></p>
                  <p className="text-gray-500">Animal: <span className="font-semibold text-gray-700">{data.raza || 'Sin información'}</span></p>
                  <p className="text-gray-500">Estado: <span className="font-semibold text-[#5B6E38]">Certificado ✓</span></p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#2C1405] p-6 text-center text-white shadow-md">
                <p className="text-xs font-bold tracking-wider uppercase text-amber-100/70">PRECIO DE VENTA</p>
                <p className="my-2 font-serif text-4xl font-bold tracking-tight">
                  ${Number(data.precio_venta || 0).toLocaleString('es-MX')}
                </p>
                <p className="text-xs font-semibold text-amber-100/50">MXN</p>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B6E38] py-3 text-sm font-bold text-white transition-colors hover:bg-[#48582C]">
                  <ImageIcon className="h-4 w-4" /> Ver Galería de Imágenes
                </button>
              </div>

              <div className="rounded-xl bg-[#F5F2DF] py-3.5 text-center text-xs font-semibold text-[#2C1405]">
                Última actualización: {formatDate(data.fecha_registro)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
