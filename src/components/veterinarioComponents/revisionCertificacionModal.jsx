import { useMemo, useState } from 'react';
import { X, Lock, ShieldCheck, PencilLine, Upload, Plus, CircleX, CircleCheckBig } from 'lucide-react';

export default function RevisionCertificacionModal({ isOpen, onClose, solicitud }) {
	const [pesoValidado, setPesoValidado] = useState('');
	const [observaciones, setObservaciones] = useState('');
	const [vacunaNombre, setVacunaNombre] = useState('');
	const [vacunaLote, setVacunaLote] = useState('');
	const [vacunaFecha, setVacunaFecha] = useState('');

	const data = useMemo(() => {
		if (!solicitud) return null;

		// Formateamos la fecha para que se vea igual que en tu diseño (ej. "14 de enero de 2026")
		const fechaFormateada = new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});

		// Mapeamos los datos exactamente como vienen de tu función fn_obtener_solicitudes_vet
		return {
			id_bd: solicitud.id_solicitud, // El ID real numérico para hacer el PUT en la BD
			codigo: solicitud.codigo_solicitud, // El ID visual (SOL-001)
			arete: solicitud.arete_animal,
			estado: solicitud.estado_solicitud,
			productor: solicitud.nombre_productor,
			rancho: solicitud.rancho,
			tipoAnimal: solicitud.tipo_ganado,
			raza: solicitud.raza,
			edad: solicitud.edad_anios,
			sexo: 'Macho', // Dato estático temporal (no viene en la función SQL actual)
			pesoEstimado: solicitud.peso_est_kg,
			condicion: 'Excelente',
			crias: 'No',
			fechaSolicitud: fechaFormateada,
			// Mock de certificaciones extra requeridas (esto podría venir de otra tabla después)
			vacunaciones: [{ nombre: 'Vacunación Aftosa', aprobada: false }],
		};
	}, [solicitud]);

	if (!isOpen || !data) return null;

	const cerrar = () => onClose();

	const handleAprobar = () => {
		// Aquí enviaremos el data.id_bd (ID real) a Axios más adelante
		console.log('Aprobar y certificar ID DB:', data.id_bd, { 
			pesoValidado, 
			observaciones, 
			vacunaNombre, 
			vacunaLote, 
			vacunaFecha 
		});
		cerrar();
	};

	const handleRechazar = () => {
		console.log('Rechazar certificación ID DB:', data.id_bd, { observaciones });
		cerrar();
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/50 p-0 md:p-4">
			<div className="mx-auto flex h-full w-full max-w-275 flex-col overflow-hidden bg-white shadow-2xl md:h-[calc(100vh-2rem)] md:rounded-[18px]">
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 md:px-8 md:py-5">
					<div>
						{/* Usamos el código de solicitud (SOL-00X) para el título */}
						<h2 className="text-[20px] font-bold text-[#111827] md:text-[26px]">Revisión de Certificación - {data.codigo}</h2>
						<span className="mt-2 inline-flex rounded-full bg-[#FFF1C7] px-3 py-1 text-[11px] font-semibold text-[#8B6E00] border border-[#F1DE9C]">{data.estado}</span>
					</div>
					<button onClick={cerrar} className="rounded-full p-2 text-[#111827] transition-colors hover:bg-gray-100" aria-label="Cerrar modal">
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
								<div>
									<p className="text-[11px] text-[#6B7280]">Identificación</p>
									{/* Aquí usamos el arete_id del animal */}
									<p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.arete}</p>
								</div>
								<div>
									<p className="text-[11px] text-[#6B7280]">Tipo de Animal</p>
									<p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.tipoAnimal}</p>
								</div>
								<div>
									<p className="text-[11px] text-[#6B7280]">Fecha de Solicitud</p>
									<p className="mt-1 text-[14px] font-semibold text-[#111827]">{data.fechaSolicitud}</p>
								</div>
							</div>
						</div>
					</section>

					<section className="mt-8 space-y-4">
						<div className="flex items-center gap-2">
							<PencilLine className="h-5 w-5 text-[#2E6B2C]" />
							<h3 className="text-[18px] font-bold">Datos del Animal</h3>
						</div>
						<div className="rounded-2xl border border-[#BFD7B8] bg-[#F8FCF7] px-6 py-6">
							<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Raza *</span>
									<select className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" defaultValue={data.raza}>
										<option>{data.raza}</option>
									</select>
								</label>
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Edad (años) *</span>
									<input type="text" defaultValue={data.edad} className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</label>
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Sexo *</span>
									<select className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" defaultValue={data.sexo}>
										<option>{data.sexo}</option>
									</select>
								</label>

								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Peso Validado (kg) *</span>
									<input type="text" value={pesoValidado} onChange={(event) => setPesoValidado(event.target.value)} placeholder="Ingresa el peso real del animal" className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
									<span className="mt-2 block text-[11px] text-[#6B7280]">Peso estimado por productor: {data.pesoEstimado} kg</span>
								</label>
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Condición Corporal *</span>
									<select className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" defaultValue={data.condicion}>
										<option>{data.condicion}</option>
									</select>
								</label>
								<div className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">¿Tiene crías?</span>
									<div className="flex items-center gap-6 pt-3 text-[14px] text-[#111827]">
										<label className="flex items-center gap-2"><input type="radio" name="crias" defaultChecked={data.crias === 'Sí'} /><span>Sí</span></label>
										<label className="flex items-center gap-2"><input type="radio" name="crias" defaultChecked={data.crias !== 'Sí'} /><span>No</span></label>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="mt-8 space-y-4">
						<div className="flex items-center gap-2">
							<ShieldCheck className="h-5 w-5 text-[#2E6B2C]" />
							<h3 className="text-[18px] font-bold">Certificaciones Extras</h3>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 md:px-6">
							{data.vacunaciones.map((item) => (
								<div key={item.nombre} className="flex flex-col gap-3 border-b border-gray-100 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
									<div className="flex items-center gap-3">
										<ShieldCheck className="h-5 w-5 text-[#7C8A9A]" />
										<span className="text-[14px] font-medium text-[#111827]">{item.nombre}</span>
									</div>
									<div className="flex gap-2">
										<button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#F7F7F4] px-4 py-2 text-[12px] font-medium text-[#111827] shadow-sm hover:bg-gray-100"><CircleCheckBig className="h-4 w-4 text-[#2E6B2C]" />Aprobar</button>
										<button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-[#F7F7F4] px-4 py-2 text-[12px] font-medium text-[#111827] shadow-sm hover:bg-gray-100"><CircleX className="h-4 w-4 text-[#111827]" />Rechazar</button>
									</div>
								</div>
							))}
						</div>
					</section>

					<section className="mt-8 space-y-4">
						<div className="flex items-center gap-2">
							<Upload className="h-5 w-5 text-[#2E6B2C]" />
							<h3 className="text-[18px] font-bold">Vacunaciones Aplicadas</h3>
							<span className="rounded-full bg-[#EAF5E3] px-2.5 py-0.5 text-[10px] font-semibold text-[#2E6B2C] border border-[#CFE5C4]">Opcional</span>
						</div>
						<p className="text-[12px] text-[#6B7280] font-sans">Registra las vacunas aplicadas durante la revisión veterinaria</p>
						<div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-4 md:p-5">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Nombre de la vacuna</span>
									<input value={vacunaNombre} onChange={(event) => setVacunaNombre(event.target.value)} type="text" placeholder="Ej: Vacuna contra Aftosa" className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</label>
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">No. de Lote</span>
									<input value={vacunaLote} onChange={(event) => setVacunaLote(event.target.value)} type="text" placeholder="Ej: LOT-2025-001" className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</label>
								<label className="block">
									<span className="mb-2 block text-[12px] font-medium text-[#111827]">Fecha de aplicación</span>
									<input value={vacunaFecha} onChange={(event) => setVacunaFecha(event.target.value)} type="text" placeholder="mm/dd/yyyy" className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-[14px] outline-none placeholder:text-gray-400 focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</label>
							</div>
							<button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#A2C195] px-4 py-3 text-[13px] font-semibold text-white shadow-sm hover:bg-[#8FB17F]"><Plus className="h-4 w-4" />Agregar Vacunación</button>
						</div>
					</section>

					<div className="my-8 border-t border-gray-200" />

					<section className="space-y-4">
						<h3 className="text-[18px] font-bold">Observaciones Veterinarias</h3>
						<label className="block">
							<span className="mb-2 block text-[12px] font-medium text-[#111827]">Observaciones Técnicas *</span>
							<textarea rows="6" value={observaciones} onChange={(event) => setObservaciones(event.target.value)} placeholder="Agrega tus observaciones profesionales sobre el estado del animal..." className="w-full resize-none rounded-xl border border-[#CBD5E1] bg-white px-4 py-4 text-[14px] text-[#111827] outline-none placeholder:text-gray-400 focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
						</label>
					</section>
				</div>

				<div className="border-t border-gray-200 px-4 py-4 md:px-8 md:py-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<button onClick={handleRechazar} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FF2F2F] bg-white px-6 py-4 text-[14px] font-semibold text-[#E11D1D] transition-colors hover:bg-red-50"><CircleX className="h-5 w-5" />Rechazar Certificación</button>
						<button onClick={handleAprobar} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9DBA8E] bg-[#A5C49A] px-6 py-4 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#90B585]"><CircleCheckBig className="h-5 w-5" />Aprobar y Certificar</button>
					</div>
				</div>
			</div>
		</div>
	);
}
