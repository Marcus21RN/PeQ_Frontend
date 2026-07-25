import { useEffect, useState } from 'react';
import { Lock, PenLine, Stethoscope, TriangleAlert, User, X } from 'lucide-react';

export default function EditarPerfilModal({ isOpen, onClose, dataActual }) {
	const [formData, setFormData] = useState({});

	useEffect(() => {
		if (!isOpen) return;
		setFormData(dataActual || {
			nombre: 'Dr. Alberto Méndez Ruiz',
			correo: 'alberto.mendez@email.com',
			telefono: '5554567890',
			curp: 'MERA880315HDFRBL05',
			cedula: '9876543',
			universidad: 'Universidad Nacional Autónoma de México (UNAM)',
			especialidad: 'Medicina Veterinaria y Zootecnia',
			experiencia: '8 años',
			municipio: 'Guadalajara',
			estado: 'Jalisco',
			fechaRegistro: '9 de marzo de 2024',
		});
	}, [dataActual, isOpen]);

	if (!isOpen) return null;

	const handleInputChange = (event) => {
		setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm" onClick={onClose}>
			<div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-[22px] bg-[#F8F9FA] shadow-2xl" onClick={(event) => event.stopPropagation()}>
				<div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
					<div>
						<h2 className="text-[24px] font-bold text-[#111827]">Editar Perfil</h2>
						<p className="mt-1 text-sm text-[#5C6470] font-sans">Realiza modificaciones a tu información profesional</p>
					</div>
					<button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Cerrar modal">
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-6 font-sans">
					<div className="rounded-2xl border border-[#B9E3A9] bg-[#DFF5CF] px-4 py-4 text-[#245822]">
						<div className="flex items-start gap-3">
							<TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
							<p className="text-sm leading-6">Los cambios a tu información profesional requieren revisión interna. Solo la contraseña se actualiza de forma inmediata.</p>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
							<p className="text-xs text-[#6B7280]">Profesión</p>
							<p className="mt-2 text-base font-bold text-[#111827]">{formData.especialidad || 'Medicina Veterinaria y Zootecnia'}</p>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
							<p className="text-xs text-[#6B7280]">Cédula Profesional</p>
							<p className="mt-2 text-base font-bold text-[#111827]">{formData.cedula || '9876543'}</p>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
							<p className="text-xs text-[#6B7280]">Experiencia</p>
							<p className="mt-2 text-base font-bold text-[#111827]">{formData.experiencia || '8 años'}</p>
						</div>
					</div>

					<form id="form-editar-perfil-vet" onSubmit={handleSubmit} className="space-y-6">
						<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
							<div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
								<User className="h-5 w-5 text-[#2E6B2C]" />
								<h3 className="text-lg font-bold text-[#111827]">Datos Personales</h3>
							</div>
							<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Nombre Completo</label>
									<input name="nombre" value={formData.nombre || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Correo Electrónico</label>
									<input name="correo" value={formData.correo || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280] flex items-center gap-1">CURP <Lock className="h-3 w-3" /> No editable</label>
									<p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827]">{formData.curp}</p>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Teléfono</label>
									<input name="telefono" value={formData.telefono || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
							</div>
						</div>

						<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
							<div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
								<Stethoscope className="h-5 w-5 text-[#2E6B2C]" />
								<h3 className="text-lg font-bold text-[#111827]">Información Profesional</h3>
							</div>
							<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Especialidad</label>
									<input name="especialidad" value={formData.especialidad || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Universidad</label>
									<input name="universidad" value={formData.universidad || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Municipio</label>
									<input name="municipio" value={formData.municipio || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Estado</label>
									<input name="estado" value={formData.estado || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280] flex items-center gap-1">Fecha de Registro <Lock className="h-3 w-3" /> No editable</label>
									<p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827]">{formData.fechaRegistro}</p>
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Cédula Profesional</label>
									<input name="cedula" value={formData.cedula || ''} onChange={handleInputChange} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15" />
								</div>
							</div>
						</div>
					</form>
				</div>

				<div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-6 py-5 sm:flex-row sm:justify-end">
					<button type="button" onClick={onClose} className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-[#111827] transition-colors hover:bg-gray-50">Cancelar</button>
					<button type="submit" form="form-editar-perfil-vet" className="rounded-xl bg-[#2E6B2C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235322]">Enviar Cambios</button>
				</div>
			</div>
		</div>
	);
}