import { useState } from 'react';
import { Eye, MapPin, Scale, CalendarDays, UserRound } from 'lucide-react';

import RevisionCertificacionModal from '../../components/veterinarioComponents/revisionCertificacionModal.jsx';

export default function VetDasbouard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

	const mockStats = {
		pendientes: 6,
	};

	const mockSolicitudes = [
		{
			id: 'A-002',
			nombre: 'Angus',
			productor: 'Juan Pérez',
			rancho: 'Rancho El Paraíso',
			edad: '2.5 años',
			peso: '450 kg',
			fecha: '14 de enero de 2026',
		},
		{
			id: 'A-008',
			nombre: 'Hereford',
			productor: 'Roberto Sánchez',
			rancho: 'Rancho la Esperanza',
			edad: '2 años',
			peso: '410 kg',
			fecha: '27 de enero de 2026',
		},
		{
			id: 'B-207',
			nombre: 'Simmental',
			productor: 'Fernando Torres',
			rancho: 'Traspatio',
			edad: '1.5 años',
			peso: '380 kg',
			fecha: '4 de febrero de 2026',
		},
		{
			id: 'A-004',
			nombre: 'Brahman',
			productor: 'María González',
			rancho: 'Rancho San José',
			edad: '3.5 años',
			peso: '490 kg',
			fecha: '17 de febrero de 2026',
		},
	];

	const handleRevisar = (solicitud) => {
		setSolicitudSeleccionada(solicitud);
		setIsModalOpen(true);
	};

	return (
		<div className="min-h-[calc(100vh-2rem)] bg-[#F7F7F4] px-4 py-4 md:px-6 md:py-6 font-serif">
			<div className="mx-auto max-w-6xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-[#111827]">Solicitudes de Certificación</h1>
					<p className="text-sm text-[#5C6470] font-sans">Revisa y valida las solicitudes pendientes</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
					<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between max-w-[170px] h-[96px]">
						<span className="text-[11px] text-[#8C8C8C] text-center">Pendientes</span>
						<span className="text-3xl font-bold text-[#111827] text-center leading-none">{mockStats.pendientes}</span>
					</div>
				</div>

				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					<div className="p-6 border-b border-gray-100">
						<h2 className="text-xl font-bold text-[#111827]">Solicitudes Pendientes de Revisión</h2>
					</div>

					<div className="flex flex-col">
						{mockSolicitudes.map((solicitud, index) => (
							<div
								key={solicitud.id}
								className={`px-6 py-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between hover:bg-[#FBFBF8] transition-colors ${
									index !== mockSolicitudes.length - 1 ? 'border-b border-gray-100' : ''
								}`}
							>
								<div className="flex-1 space-y-4">
									<div className="flex items-center gap-3 flex-wrap">
										<h3 className="text-lg font-bold text-[#111827]">{solicitud.id} - {solicitud.nombre}</h3>
										<span className="inline-flex items-center rounded-full bg-[#FFF1C7] px-2.5 py-0.5 text-[10px] font-semibold text-[#8B6E00] border border-[#F1DE9C]">
											Pendiente
										</span>
									</div>

									<div className="grid grid-cols-1 gap-3 text-[11px] text-[#3E4954] md:grid-cols-4 md:gap-4">
										<div className="flex items-center gap-2">
											<UserRound className="h-4 w-4 text-[#A0A0A0]" />
											<span>Productor: {solicitud.productor}</span>
										</div>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-[#A0A0A0]" />
											<span>Rancho: {solicitud.rancho}</span>
										</div>
										<div className="flex items-center gap-2">
											<CalendarDays className="h-4 w-4 text-[#A0A0A0]" />
											<span>Edad: {solicitud.edad}</span>
										</div>
										<div className="flex items-center gap-2">
											<Scale className="h-4 w-4 text-[#A0A0A0]" />
											<span>Peso Est.: {solicitud.peso}</span>
										</div>
									</div>

									<div className="text-[10px] text-[#8C8C8C]">
										Solicitado el {solicitud.fecha}
									</div>
								</div>

								<div className="flex justify-start lg:justify-end">
									<button
										onClick={() => handleRevisar(solicitud)}
										className="inline-flex items-center gap-2 rounded-lg border border-[#1F5E16] bg-[#2E6B2C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#235322]"
									>
										<Eye className="h-4 w-4" />
										Revisar
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<RevisionCertificacionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				solicitud={solicitudSeleccionada}
			/>
		</div>
	);
}
