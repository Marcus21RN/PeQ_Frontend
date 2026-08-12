import { X, CircleDollarSign, MapPin, Phone, UserRound, ShieldCheck, CalendarCheck2, Stethoscope, Syringe, BadgeCheck } from 'lucide-react';
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
    historial_medico: Array.isArray(base.historial_medico) ? base.historial_medico : Array.isArray(animal.historial_medico) ? animal.historial_medico : [],
  };
};

const moneyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
});

const formatDate = (value) => {
  if (!value) return 'Sin información';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

const formatPeso = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 'Sin peso';
  return `${numeric} kg`;
};

const formatYesNo = (value) => {
  if (value === true || value === 'true' || value === 'Sí' || value === 'si' || value === 'Si') return 'Sí';
  if (value === false || value === 'false' || value === 'No' || value === 'no') return 'No';
  return value || 'Sin información';
};

export default function FichaTecnicaPublicoModal({ isOpen, onClose, animal = {} }) {
  if (!isOpen) return null;

  const data = normalizeAnimal(animal);
  const qrValue = data.no_identificacion || 'ficha-tecnica';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/30 backdrop-blur-[1px] px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-[18px] border border-[#d7d2cc] bg-[#f3f1ee] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#d7d2cc] bg-[#f8f6f4] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d7d2cc] bg-white px-3 py-2 text-sm font-medium text-[#4a2d1d] hover:bg-[#f5f2ee]"
          >
            <X size={16} />
            Volver a la lista
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.75fr_0.95fr]">
          <div className="space-y-5">
            <section className="rounded-[16px] border border-[#d7d2cc] bg-[#f8f6f4] p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-[#2c1b12]">{data.no_identificacion || 'Sin identificación'}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#5e473c]">
                    <span className="font-medium">{data.raza || 'Sin raza'}</span>
                    <span>•</span>
                    <span>{data.sexo || 'Sin sexo'}</span>
                  </div>
                </div>

                <span className="rounded-lg bg-[#6d8f3b] px-3 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                  {data.condicion_general || 'Excelente'}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <InfoItem icon={<BadgeCheck size={14} />} label="No. de identificación" value={data.no_identificacion || 'Sin información'} />
                <InfoItem icon={<CalendarCheck2 size={14} />} label="Edad" value={`${data.edad || 0} años`} />
                <InfoItem icon={<CircleDollarSign size={14} />} label="Peso" value={formatPeso(data.peso_kg)} />
                <InfoItem icon={<CalendarCheck2 size={14} />} label="Registro" value={formatDate(data.fecha_registro)} />
              </div>

              <div className="mt-5 grid gap-4 border-t border-[#d7d2cc] pt-4 md:grid-cols-2">
                <InfoRow label="Propósito de venta" value={data.proposito_produccion || 'Sin información'} />
                <InfoRow label="Condición" value={data.condicion_general || 'Sin información'} />
                <InfoRow label="Tipo de producción" value={data.tipo_rancho || 'Sin información'} />
                <InfoRow label="Tiene crías" value={formatYesNo(data.tiene_crias)} />
                <InfoRow label="Origen" value={data.ubicacion_origen || 'Sin información'} />
                <InfoRow label="Rancho" value={data.nombre_rancho || 'Sin información'} />
                <InfoRow label="Fecha de certificación" value={formatDate(data.fecha_certificacion)} />
                <InfoRow label="Próxima revisión" value={formatDate(data.proxima_revision_sugerida)} />
              </div>

              <div className="mt-5 border-t border-[#d7d2cc] pt-4">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5e473c]">Notas adicionales</p>
                <p className="text-sm text-[#43342d]">{data.notas_adicionales || 'No se registraron notas adicionales.'}</p>
              </div>
            </section>

            <section className="rounded-[16px] border border-[#d7d2cc] bg-[#f8f6f4] p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[#2d1d12]">
                <ShieldCheck size={16} />
                <h4 className="text-lg font-bold">Certificaciones</h4>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <DetailPill label="Certificado por" value={data.certificado_por || 'Sin información'} />
                <DetailPill label="Cédula profesional" value={data.cedula_profesional || 'Sin información'} />
                <DetailPill label="Fecha de certificación" value={formatDate(data.fecha_certificacion)} />
                <DetailPill label="Próxima revisión" value={formatDate(data.proxima_revision_sugerida)} />
              </div>
            </section>

            <section className="rounded-[16px] border border-[#d7d2cc] bg-[#f8f6f4] p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[#2d1d12]">
                <UserRound size={16} />
                <h4 className="text-lg font-bold">Información del productor</h4>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Nombre del rancho" value={data.nombre_rancho || 'Sin información'} />
                <InfoRow label="Tipo de rancho" value={data.tipo_rancho || 'Sin información'} />
                <InfoRow label="Propietario" value={data.propietario || 'Sin información'} />
                <InfoRow label="Contacto" value={data.contacto_propietario || 'Sin información'} />
                <InfoRow label="Ubicación" value={data.ubicacion_origen || 'Sin información'} />
              </div>
            </section>

            <section className="rounded-[16px] border border-[#d7d2cc] bg-[#f8f6f4] p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[#2d1d12]">
                <Syringe size={16} />
                <h4 className="text-lg font-bold">Historial médico</h4>
              </div>

              {data.historial_medico && data.historial_medico.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.historial_medico.map((item, index) => (
                    <div key={`${item.enfermedad || 'historial'}-${index}`} className="rounded-xl border border-[#d7d2cc] bg-white p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#5e473c]">Enfermedad</p>
                      <p className="mt-1 text-sm font-medium text-[#2d1d12]">{item.enfermedad || 'Sin información'}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#5e473c]">Estado</p>
                      <p className="mt-1 text-sm text-[#2d1d12]">{item.status_medico || 'Sin información'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#5e473c]">No hay historial médico registrado.</p>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[16px] border border-[#d7d2cc] bg-[#f8f6f4] p-4 shadow-sm">
              <div className="mb-3 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#5e473c]">Código QR</p>
              </div>
              <div className="flex justify-center rounded-xl border border-[#d7d2cc] bg-white p-4">
                <QRCodeSVG value={qrValue} size={180} bgColor="#FFFFFF" fgColor="#1f1f1f" />
              </div>
              <p className="mt-3 text-center text-xs text-[#5e473c]">Escanea para abrir la ficha técnica</p>
            </section>

            <section className="rounded-[16px] border border-[#d7d2cc] bg-[#f8f6f4] p-4 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#5e473c]">Información del QR</p>
              <div className="mt-4 space-y-3 rounded-xl bg-[#f2efe8] p-4 text-sm text-[#2d1d12]">
                <div>
                  <span className="font-semibold">No. de animal:</span> {data.no_identificacion || 'Sin información'}
                </div>
                <div>
                  <span className="font-semibold">Rancho:</span> {data.nombre_rancho || 'Sin información'}
                </div>
                <div>
                  <span className="font-semibold">Certificado:</span> {data.certificado_por || 'Sin información'}
                </div>
              </div>
            </section>

            <section className="rounded-[16px] border border-[#6f4d2b] bg-[#4c2d1d] p-5 text-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#efe7df]">Precio de venta</p>
              <div className="mt-3 text-4xl font-bold">{moneyFormatter.format(Number(data.precio_venta || 0))}</div>
              <p className="mt-2 text-xs text-[#e8d5c0]">Monto vigente para este animal</p>
            </section>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6d8f3b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5d7c30]"
            >
              <ShieldCheck size={16} />
              Ver ficha técnica
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#d7d2cc] bg-white p-3">
      <div className="mb-2 flex items-center gap-2 text-[#5e473c]">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-medium text-[#2d1d12]">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-[#d7d2cc] pb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5e473c]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#2d1d12]">{value}</p>
    </div>
  );
}

function DetailPill({ label, value }) {
  return (
    <div className="rounded-xl border border-[#d7d2cc] bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5e473c]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#2d1d12]">{value}</p>
    </div>
  );
}
