import { useState, useEffect } from 'react';
import { BookText, Clock, FileText, Lock, Pencil, Stethoscope, User } from 'lucide-react';

import CambiarContrasenaModal from '../../components/veterinarioComponents/cambiarContrasenaModal.jsx';
import SolicitudesCambioModal from '../../components/veterinarioComponents/solicitudCambioModal.jsx';
import EditarPerfilModal from '../../components/veterinarioComponents/editarPerfilModal.jsx';
import { getPerfilDetallado } from '../../services/apiVeterinario/solicitudesPanel.js';
import { getDocumentosSubidos } from '../../services/apiVeterinario/solicitudesPanel.js';



export default function VetPerfil() {
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isSolicitudesModalOpen, setIsSolicitudesModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [toast, setToast] = useState(null);
	
	const [perfil, setPerfil] = useState(null);
	const [loading, setLoading] = useState(true);

	const [documentos, setDocumentos] = useState([]);

	const fetchPerfil = async () => {
		try {
			setLoading(true);
			const id_usuario = localStorage.getItem('id_usuario');
			const response = await getPerfilDetallado(id_usuario);
			const documentos = await getDocumentosSubidos(id_usuario);
			response.documentos = documentos;
			setPerfil(response);
			setDocumentos(documentos);
		} catch (error) {
			console.error('Error al obtener el perfil detallado:', error);
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		void Promise.resolve().then(fetchPerfil);
	}, []);

	useEffect(() => {
		if (!toast) return undefined;

		const timeoutId = window.setTimeout(() => {
			setToast(null);
		}, 3200);

		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	// Funciones para mantener tu formato de fechas visual
	const formatearMesAnio = (fechaISO) => {
		if (!fechaISO) return '';
		return new Date(fechaISO).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
	};

	const formatearFechaCompleta = (fechaISO) => {
		if (!fechaISO) return '';
		return new Date(fechaISO).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
	};

	const mostrarToastExito = (mensaje) => {
		setToast({
			type: 'success',
			message: mensaje,
		});
	};

	if (loading) {
		return <div className="min-h-screen flex items-center justify-center font-sans">Cargando perfil...</div>;
	}

	if (!perfil) {
		return <div className="min-h-screen flex items-center justify-center font-sans">No se pudo cargar la información.</div>;
	}

	return (
		<div className="min-h-[calc(100vh-2rem)] bg-[#F7F7F4] px-4 py-4 md:px-6 md:py-6 font-serif">
			{toast && (
				<div className="fixed right-4 top-4 z-60 w-[calc(100vw-2rem)] max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 shadow-2xl shadow-emerald-900/10">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Actualización exitosa</p>
					<p className="mt-1 text-sm text-emerald-900">{toast.message}</p>
				</div>
			)}
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-[30px] font-bold text-[#111827] md:text-[34px]">Mi Perfil</h1>
					<p className="text-sm text-[#5C6470] font-sans">Consulta y gestiona tu información profesional</p>
				</div>

				{/* Se ajustó a grid-cols-2 ya que quitamos "Años de Experiencia" */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 font-sans">
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<p className="text-xs text-[#6B7280]">Certificaciones Realizadas</p>
						<p className="mt-2 text-3xl font-bold text-[#111827]">{perfil.resumen.certificaciones_realizadas}</p>
					</div>
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<p className="text-xs text-[#6B7280]">Miembro Desde</p>
						<p className="mt-2 text-3xl font-bold text-[#111827] capitalize">{formatearMesAnio(perfil.resumen.miembro_desde)}</p>
					</div>
				</div>

				<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
						<User className="h-5 w-5 text-[#2E6B2C]" />
						<h2 className="text-lg font-bold text-[#111827]">Datos Personales</h2>
					</div>

					<div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2">
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Nombre Completo</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_personales.nombre_completo}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">CURP</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_personales.curp}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Correo Electrónico</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_personales.email}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Teléfono</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_personales.telefono}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Municipio</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_personales.municipio}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Estado</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_personales.estado}</p>
						</div>
					</div>
				</section>

				<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
						<Stethoscope className="h-5 w-5 text-[#2E6B2C]" />
						<h2 className="text-lg font-bold text-[#111827]">Datos Profesionales</h2>
					</div>

					<div className="grid grid-cols-1 gap-8 px-6 py-8 md:grid-cols-2">
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Cédula Profesional</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_profesionales.cedula_profesional}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Universidad</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_profesionales.universidad}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Especialidad</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.datos_profesionales.especialidad}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Fecha de Registro</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{formatearFechaCompleta(perfil.datos_profesionales.fecha_registro)}</p>
						</div>
					</div>
				</section>

				<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
						<BookText className="h-5 w-5 text-[#2E6B2C]" />
						<h2 className="text-lg font-bold text-[#111827]">Documentación Personal</h2>
					</div>

					<div className="space-y-3 px-4 py-5 md:px-6">
						{documentos.map((documento) => (
							<div key={documento.titulo} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#FBFBF8] px-4 py-4 transition-colors hover:bg-white">
								<div className="flex items-center gap-3">
									<FileText className="h-5 w-5 text-[#3A4A60]" />
									<div>
										<p className="text-sm font-medium text-[#111827]">{documento.titulo}</p>
										<p className="text-xs text-[#6B7280]">{documento.archivo}</p>
									</div>
								</div>
								<button className="inline-flex items-center gap-2 text-sm font-medium text-[#2E6B2C] hover:text-[#235322]">
									Ver
								</button>
							</div>
						))}
					</div>
				</section>

				<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="flex flex-col flex-wrap items-center justify-center gap-4 md:flex-row">
						<button
							onClick={() => setIsPasswordModalOpen(true)}
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2E6B2C] px-6 py-3 text-sm font-medium text-[#2E6B2C] transition-colors hover:bg-[#F3FAF4]"
						>
							<Lock className="h-4 w-4" />
							Cambiar Contraseña
						</button>

						<button
							onClick={() => setIsSolicitudesModalOpen(true)}
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FF9800] px-6 py-3 text-sm font-medium text-[#F57C00] transition-colors hover:bg-[#FFF8EE]"
						>
							<Clock className="h-4 w-4" />
							Solicitudes de Cambio
						</button>

						<button
							onClick={() => setIsEditModalOpen(true)}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2E6B2C] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#235322]"
						>
							<Pencil className="h-4 w-4" />
							Editar Perfil
						</button>
					</div>
				</section>
			</div>

			<CambiarContrasenaModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
			<SolicitudesCambioModal isOpen={isSolicitudesModalOpen} onClose={() => setIsSolicitudesModalOpen(false)} />
			<EditarPerfilModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				dataActual={perfil}
				onSuccess={() => {
					fetchPerfil();
					mostrarToastExito('Tu perfil veterinario se actualizó correctamente.');
				}}
			/>
		</div>
	);
}
