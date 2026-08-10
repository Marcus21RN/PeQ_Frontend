import { useEffect, useState } from 'react';
import { Lock, Stethoscope, TriangleAlert, User, X } from 'lucide-react';

import { actualizarPerfilVeterinario } from '../../services/apiVeterinario/solicitudesPanel.js';

export default function EditarPerfilModal({ isOpen, onClose, dataActual, onSuccess }) {
	const [formData, setFormData] = useState({
		nombre: '',
		apellido_paterno: '',
		apellido_materno: '',
		email: '',
		telefono: '',
		curp: '',
		cedula: '',
		universidad: '',
		especialidad: '',
		ciudad: '',
		estado: '',
		fechaRegistro: '',
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!isOpen || !dataActual) return;

		const formatearFechaLegible = (fechaISO) => {
			if (!fechaISO) return '';
			try {
				const fecha = new Date(fechaISO);
				return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
			} catch {
				return fechaISO;
			}
		};

		const separarNombre = (nombreCompleto) => {
			if (!nombreCompleto) return { nombre: '', paterno: '', materno: '' };
			
			let nombreLimpio = nombreCompleto.replace(/^(Dr\.|Dra\.|Ing\.|Lic\.|Mvz\.)\s+/i, '').trim();
			const partes = nombreLimpio.split(' ').filter(Boolean);
			
			if (partes.length === 1) {
				return { nombre: partes[0], paterno: '', materno: '' };
			} else if (partes.length === 2) {
				return { nombre: partes[0], paterno: partes[1], materno: '' };
			} else {
				const materno = partes.pop();
				const paterno = partes.pop();
				const nombre = partes.join(' ');
				return { nombre, paterno, materno };
			}
		};

		const nombresSeparados = separarNombre(dataActual.datos_personales?.nombre_completo);

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setFormData({
			nombre: nombresSeparados.nombre,
			apellido_paterno: nombresSeparados.paterno,
			apellido_materno: nombresSeparados.materno,
			email: dataActual.datos_personales?.email || '',
			telefono: dataActual.datos_personales?.telefono || '',
			curp: dataActual.datos_personales?.curp || '',
			cedula: dataActual.datos_profesionales?.cedula_profesional || '',
			universidad: dataActual.datos_profesionales?.universidad || '',
			especialidad: dataActual.datos_profesionales?.especialidad || '',
			ciudad: dataActual.datos_personales?.municipio || '',
			estado: dataActual.datos_personales?.estado || '',
			fechaRegistro: formatearFechaLegible(dataActual.datos_profesionales?.fecha_registro),
		});
	}, [dataActual, isOpen]);

	if (!isOpen) return null;

	const handleInputChange = (event) => {
		setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		try {
			const payload = {
				nombre: formData.nombre,
				apellido_paterno: formData.apellido_paterno,
				apellido_materno: formData.apellido_materno,
				email: formData.email,
				telefono: formData.telefono,
				ciudad: formData.ciudad,
				especialidad: formData.especialidad
			};

			await actualizarPerfilVeterinario(payload);

			alert('¡Tus cambios han sido enviados exitosamente!');
			onClose();
			
			if (typeof onSuccess === 'function') {
				onSuccess();
			}
		} catch (error) {
			console.error('Error al actualizar el perfil:', error);
			alert(error.message || 'Ocurrió un error al intentar enviar los cambios. Por favor, intenta de nuevo.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm" onClick={onClose}>
			<div className="flex w-full max-w-5xl max-h-[90vh] flex-col overflow-hidden rounded-[22px] bg-[#F8F9FA] shadow-2xl" onClick={(event) => event.stopPropagation()}>
				<div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-5">
					<div>
						<h2 className="text-[24px] font-bold text-[#111827]">Editar Perfil</h2>
						<p className="mt-1 text-sm text-[#5C6470] font-sans">Realiza modificaciones a tu información profesional</p>
					</div>
					<button onClick={onClose} disabled={isLoading} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50" aria-label="Cerrar modal">
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
							<p className="mt-2 text-base font-bold text-[#111827]">{formData.especialidad}</p>
						</div>
						<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
							<p className="text-xs text-[#6B7280]">Cédula Profesional</p>
							<p className="mt-2 text-base font-bold text-[#111827]">{formData.cedula}</p>
						</div>
					</div>

					<form id="form-editar-perfil-vet" onSubmit={handleSubmit} className="space-y-6">
						<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
							<div className="flex items-center gap-3 border-b border-gray-200 px-6 py-4">
								<User className="h-5 w-5 text-[#2E6B2C]" />
								<h3 className="text-lg font-bold text-[#111827]">Datos Personales</h3>
							</div>
							<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Nombre(s)</label>
									<input name="nombre" value={formData.nombre} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Apellido Paterno</label>
									<input name="apellido_paterno" value={formData.apellido_paterno} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Apellido Materno</label>
									<input name="apellido_materno" value={formData.apellido_materno} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Correo Electrónico</label>
									<input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Teléfono</label>
									<input name="telefono" value={formData.telefono} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280] flex items-center gap-1">CURP <Lock className="h-3 w-3" /> No editable</label>
									<input name="curp" value={formData.curp} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827] outline-none cursor-not-allowed" />
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
									<input name="especialidad" value={formData.especialidad} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Universidad</label>
									<input name="universidad" value={formData.universidad} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280]">Municipio / Ciudad</label>
									<input name="ciudad" value={formData.ciudad} onChange={handleInputChange} disabled={isLoading} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15 disabled:opacity-60" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280] flex items-center gap-1">Estado <Lock className="h-3 w-3" /> Solo Admin</label>
									<input name="estado" value={formData.estado} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827] outline-none cursor-not-allowed" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280] flex items-center gap-1">Fecha de Registro <Lock className="h-3 w-3" /> No editable</label>
									<input name="fechaRegistro" value={formData.fechaRegistro} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827] outline-none cursor-not-allowed" />
								</div>
								<div className="space-y-2">
									<label className="text-xs font-medium text-[#6B7280] flex items-center gap-1">Cédula Profesional <Lock className="h-3 w-3" /> No editable</label>
									<input name="cedula" value={formData.cedula} readOnly className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#111827] outline-none cursor-not-allowed" />
								</div>
							</div>
						</div>
					</form>
				</div>

				<div className="flex flex-col gap-3 border-t border-gray-200 bg-white px-6 py-5 sm:flex-row sm:justify-end">
					<button type="button" onClick={onClose} disabled={isLoading} className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium text-[#111827] transition-colors hover:bg-gray-50 disabled:opacity-50">Cancelar</button>
					<button type="submit" form="form-editar-perfil-vet" disabled={isLoading} className="rounded-xl bg-[#2E6B2C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#235322] disabled:opacity-70">
						{isLoading ? 'Guardando...' : 'Enviar Cambios'}
					</button>
				</div>
			</div>
		</div>
	);
}
