import { useState } from 'react';
import { BookText, Clock, FileText, Lock, Pencil, Stethoscope, User } from 'lucide-react';

import CambiarContrasenaModal from '../../components/veterinarioComponents/cambiarContrasenaModal.jsx';
import SolicitudesCambioModal from '../../components/veterinarioComponents/solicitudcCambioModal.jsx';
import EditarPerfilModal from '../../components/veterinarioComponents/editarPerfilModal.jsx';

export default function VetPerfil() {
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isSolicitudesModalOpen, setIsSolicitudesModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const perfil = {
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
		miembroDesde: 'mar 2024',
		fechaRegistro: '9 de marzo de 2024',
		estatus: 'Certificador Activo',
		certificaciones: 87,
		experienciaAnios: 8,
	};

	const documentos = [
		{ titulo: 'Identificación Oficial (INE)', archivo: 'ine_mendez.pdf' },
		{ titulo: 'Comprobante de Domicilio', archivo: 'comprobante_domicilio.pdf' },
		{ titulo: 'Cédula Profesional', archivo: 'cedula_profesional.pdf' },
		{ titulo: 'Certificado de Especialización', archivo: 'certificado_especializacion.pdf' },
		{ titulo: 'Carta de Antecedentes No Penales', archivo: 'antecedentes_no_penales.pdf' },
	];

	return (
		<div className="min-h-[calc(100vh-2rem)] bg-[#F7F7F4] px-4 py-4 md:px-6 md:py-6 font-serif">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-[30px] font-bold text-[#111827] md:text-[34px]">Mi Perfil</h1>
					<p className="text-sm text-[#5C6470] font-sans">Consulta y gestiona tu información profesional</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-3 font-sans">
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<p className="text-xs text-[#6B7280]">Certificaciones Realizadas</p>
						<p className="mt-2 text-3xl font-bold text-[#111827]">{perfil.certificaciones}</p>
					</div>
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<p className="text-xs text-[#6B7280]">Años de Experiencia</p>
						<p className="mt-2 text-3xl font-bold text-[#111827]">{perfil.experienciaAnios}</p>
					</div>
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<p className="text-xs text-[#6B7280]">Miembro Desde</p>
						<p className="mt-2 text-3xl font-bold text-[#111827]">{perfil.miembroDesde}</p>
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
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.nombre}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">CURP</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.curp}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Correo Electrónico</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.correo}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Teléfono</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.telefono}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Municipio</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.municipio}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Estado</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.estado}</p>
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
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.cedula}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Universidad</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.universidad}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Especialidad</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.especialidad}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Años de Experiencia</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.experiencia}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Fecha de Registro</p>
							<p className="mt-1 text-base font-medium text-[#111827]">{perfil.fechaRegistro}</p>
						</div>
						<div>
							<p className="text-xs text-[#6B7280] font-sans">Estatus</p>
							<span className="mt-2 inline-flex rounded-full bg-[#E1F6CF] px-3 py-1 text-[11px] font-semibold text-[#2E6B2C]">{perfil.estatus}</span>
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
			<EditarPerfilModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} dataActual={perfil} />
		</div>
	);
}
