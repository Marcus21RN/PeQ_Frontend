import { useMemo } from 'react';
import { X, Lock, ShieldCheck, PenLine } from 'lucide-react';

export default function RevisionCertificacionRechazada({ isOpen, onClose, solicitud }) {
	const data = useMemo(() => {
		if (!solicitud) return null;

		const isExample = solicitud.animal === 'A-022' || solicitud.id === 'SOL-009';

		if (isExample) {
			return {
				id: 'A-022',
				estado: 'Rechazada',
				productor: 'Sofía Díaz',
				rancho: 'Rancho Santa Fe',
				tipoAnimal: 'Bovino',
				raza: 'Brahman',
				edad: '2 años',
				sexo: 'Hembra',
				peso: '400 kg',
				condicion: 'Mal',
				fechaSolicitud: '4 de enero de 2025',
				rechazo: 'Libre de Tuberculosis',
			};
		}

		return {
			id: solicitud.animal || solicitud.id,
			estado: 'Rechazada',
			productor: solicitud.productor,
			rancho: solicitud.rancho,
			tipoAnimal: solicitud.tipo || 'Bovino',
			raza: solicitud.raza || 'Sin dato',
			edad: solicitud.edad || 'Sin dato',
			sexo: 'Sin dato',
			peso: solicitud.peso || 'Sin dato',
			condicion: 'Sin dato',
			fechaSolicitud: solicitud.fecha || 'Sin dato',
			rechazo: 'Libre de Tuberculosis',
		};
	}, [solicitud]);

	if (!isOpen || !data) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/50 p-0 md:p-4">
			<div className="mx-auto flex h-full w-full max-w-[1100px] flex-col overflow-hidden bg-white shadow-2xl md:h-[calc(100vh-2rem)] md:rounded-[18px]">
				<div className="flex items-start justify-between border-b border-gray-200 px-6 py-4 md:px-8 md:py-5">
					<div>
						<h2 className="text-[20px] font-bold text-[#111827] md:text-[26px]">Detalle de Solicitud - {data.id}</h2>
						<span className="mt-2 inline-flex rounded-full bg-[#FCE1E1] px-3 py-1 text-[11px] font-semibold text-[#C93A3A] border border-[#F6C2C2]">{data.estado}</span>
					</div>
					<button onClick={onClose} className="rounded-full p-2 text-[#111827] transition-colors hover:bg-gray-100" aria-label="Cerrar modal">
						<X className="h-6 w-6" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 font-serif text-[#111827]">
					<section className="space-y-4">
						<div className="flex items-center gap-2">
							<Lock className="h-5 w-5 text-[#7C8A9A]" />
							<h3 className="text-[18px] font-bold">Información del Productor</h3>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-[#F8F9FA] px-6 py-7">
							<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div>
									<p className="text-[11px] text-[#6B7280]">Nombre</p>
									<p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.productor}</p>
								</div>
								<div>
									<p className="text-[11px] text-[#6B7280]">Rancho/Ubicación</p>
									<p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.rancho}</p>
								</div>
							</div>
						</div>
					</section>

					<section className="mt-8 space-y-4">
						<div className="flex items-center gap-2">
							<ShieldCheck className="h-5 w-5 text-[#7C8A9A]" />
							<h3 className="text-[18px] font-bold">Datos del Animal</h3>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-[#F8F9FA] px-6 py-7">
							<div className="grid grid-cols-1 gap-y-8 gap-x-12 md:grid-cols-3">
								<div><p className="text-[11px] text-[#6B7280]">Identificación</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.id}</p></div>
								<div><p className="text-[11px] text-[#6B7280]">Tipo de Animal</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.tipoAnimal}</p></div>
								<div><p className="text-[11px] text-[#6B7280]">Fecha de Solicitud</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.fechaSolicitud}</p></div>
							</div>
						</div>
					</section>

					<section className="mt-8 space-y-4">
						<div className="flex items-center gap-2">
							<PenLine className="h-5 w-5 text-[#2E6B2C]" />
							<h3 className="text-[18px] font-bold">Datos del Animal</h3>
						</div>
						<div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-6">
							<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
								<div><p className="text-[11px] text-[#6B7280]">Raza</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.raza}</p></div>
								<div><p className="text-[11px] text-[#6B7280]">Edad</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.edad}</p></div>
								<div><p className="text-[11px] text-[#6B7280]">Sexo</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.sexo}</p></div>
								<div><p className="text-[11px] text-[#6B7280]">Peso</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.peso}</p></div>
								<div><p className="text-[11px] text-[#6B7280]">Condición Corporal</p><p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.condicion}</p></div>
							</div>
						</div>
					</section>

					<section className="mt-8 space-y-4">
						<div className="flex items-center gap-2">
							<ShieldCheck className="h-5 w-5 text-[#2E6B2C]" />
							<h3 className="text-[18px] font-bold">Certificaciones Extras</h3>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-6">
							<div className="flex items-center justify-between gap-3 py-3">
								<div className="flex items-center gap-3">
									<ShieldCheck className="h-5 w-5 text-[#7C8A9A]" />
									<span className="text-[14px] font-medium text-[#111827]">{data.rechazo}</span>
								</div>
								<span className="inline-flex rounded-full bg-[#FCE1E1] px-3 py-1 text-[11px] font-semibold text-[#C93A3A] border border-[#F6C2C2]">Rechazada</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
