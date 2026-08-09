import { useMemo, useState } from 'react';
import { Search, Filter, Eye, ChevronDown, X } from 'lucide-react';

import RevisionCertificacionModal from '../../components/veterinarioComponents/revisionCertificacionModal.jsx';
import RevisionCertificacionRechazada from '../../components/veterinarioComponents/revisionCertificacionRechazada.jsx';
import RevisionCertificacionAprobada from '../../components/veterinarioComponents/revisionCertificacionAprobada.jsx';

const mockStats = {
	todas: 10,
	pendientes: 6,
	aprobadas: 3,
	rechazadas: 1,
};

const mockSolicitudes = [
	{ id: 'SOL-005', animal: 'C-012', tipo: 'Bovino', productor: 'Laura Hernández', rancho: 'Rancho Los Pinos', raza: 'Charolais', edad: '3 años', peso: '530 kg', fecha: '28 feb 2025', estado: 'Pendiente' },
	{ id: 'SOL-003', animal: 'B-105', tipo: 'Bovino', productor: 'Carlos Ramírez', rancho: 'Traspatio', raza: 'Holstein', edad: '4 años', peso: '520 kg', fecha: '19 feb 2025', estado: 'Pendiente' },
	{ id: 'SOL-002', animal: 'A-004', tipo: 'Bovino', productor: 'María González', rancho: 'Rancho San José', raza: 'Brahman', edad: '3.5 años', peso: '490 kg', fecha: '17 feb 2025', estado: 'Pendiente' },
	{ id: 'SOL-006', animal: 'B-207', tipo: 'Porcino', productor: 'Fernando Torres', rancho: 'Traspatio', raza: 'Duroc', edad: '1.5 años', peso: '380 kg', fecha: '4 feb 2025', estado: 'Pendiente' },
	{ id: 'SOL-004', animal: 'A-008', tipo: 'Bovino', productor: 'Roberto Sánchez', rancho: 'Rancho La Esperanza', raza: 'Hereford', edad: '2 años', peso: '410 kg', fecha: '27 ene 2025', estado: 'Pendiente' },
	{ id: 'SOL-001', animal: 'A-002', tipo: 'Bovino', productor: 'Juan Pérez', rancho: 'Rancho El Paraíso', raza: 'Angus', edad: '2.5 años', peso: '450 kg', fecha: '14 ene 2025', estado: 'Pendiente' },
	{ id: 'SOL-009', animal: 'A-022', tipo: 'Bovino', productor: 'Sofía Díaz', rancho: 'Rancho Santa Fe', raza: 'Brahman', edad: '2 años', peso: '400 kg', fecha: '4 ene 2025', estado: 'Rechazada' },
	{ id: 'SOL-010', animal: 'C-045', tipo: 'Bovino', productor: 'Miguel Ángel Ruiz', rancho: 'Rancho Las Palmas', raza: 'Charolais', edad: '4.5 años', peso: '550 kg', fecha: '27 dic 2024', estado: 'Aprobada' },
	{ id: 'SOL-007', animal: 'A-015', tipo: 'Bovino', productor: 'Ana López', rancho: 'Rancho El Roble', raza: 'Angus', edad: '3 años', peso: '470 kg', fecha: '9 dic 2024', estado: 'Aprobada' },
	{ id: 'SOL-008', animal: 'B-310', tipo: 'Bovino', productor: 'Pedro Martínez', rancho: 'Traspatio', raza: 'Holstein', edad: '5 años', peso: '560 kg', fecha: '21 nov 2024', estado: 'Aprobada' },
];

const razaOptions = ['Todas las razas', 'Angus', 'Brahman', 'Charolais', 'Duroc', 'Hereford', 'Holstein'];
const tipoOptions = ['Todos los tipos', 'Bovino', 'Porcino'];

export default function VetSolicitudes() {
	const [searchQuery, setSearchQuery] = useState('');
	const [razaFilter, setRazaFilter] = useState('Todas las razas');
	const [tipoFilter, setTipoFilter] = useState('Todos los tipos');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
	const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
	const [solicitudRechazadaSeleccionada, setSolicitudRechazadaSeleccionada] = useState(null);
	const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
	const [solicitudAprobadaSeleccionada, setSolicitudAprobadaSeleccionada] = useState(null);

	const filteredSolicitudes = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return mockSolicitudes.filter((solicitud) => {
			const matchesSearch = !normalizedQuery || [solicitud.id, solicitud.animal, solicitud.tipo, solicitud.productor, solicitud.rancho, solicitud.raza, solicitud.fecha, solicitud.estado]
				.some((value) => String(value).toLowerCase().includes(normalizedQuery));

			const matchesRaza = razaFilter === 'Todas las razas' || solicitud.raza === razaFilter;
			const matchesTipo = tipoFilter === 'Todos los tipos' || solicitud.tipo === tipoFilter;

			return matchesSearch && matchesRaza && matchesTipo;
		});
	}, [searchQuery, razaFilter, tipoFilter]);

	const limpiarFiltros = () => {
		setSearchQuery('');
		setRazaFilter('Todas las razas');
		setTipoFilter('Todos los tipos');
	};

	const abrirRevision = (solicitud) => {
		setSolicitudSeleccionada(solicitud);
		setIsModalOpen(true);
	};

	const abrirRechazada = (solicitud) => {
		setSolicitudRechazadaSeleccionada(solicitud);
		setIsRejectedModalOpen(true);
	};

	const abrirAprobada = (solicitud) => {
		setSolicitudAprobadaSeleccionada(solicitud);
		setIsApprovedModalOpen(true);
	};

	const getEstadoBadge = (estado) => {
		switch (estado) {
			case 'Pendiente':
				return <span className="inline-flex items-center rounded-full bg-[#FFF1B8] px-3 py-1 text-[11px] font-medium text-[#8B6E00]">Pendiente</span>;
			case 'Aprobada':
				return <span className="inline-flex items-center rounded-full bg-[#DFF8E7] px-3 py-1 text-[11px] font-medium text-[#1E7A39]">Aprobada</span>;
			case 'Rechazada':
				return <span className="inline-flex items-center rounded-full bg-[#FCE1E1] px-3 py-1 text-[11px] font-medium text-[#C93A3A]">Rechazada</span>;
			default:
				return null;
		}
	};

	const filtrosActivos =
		searchQuery.trim() !== '' || razaFilter !== 'Todas las razas' || tipoFilter !== 'Todos los tipos';

	const totalMostrados = filteredSolicitudes.length;

	return (
		<div className="min-h-[calc(100vh-2rem)] bg-[#F7F7F4] px-4 py-4 md:px-6 md:py-6 font-serif">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-[#111827]">Todas las Solicitudes</h1>
					<p className="text-sm text-[#5C6470] font-sans">Gestiona y consulta el historial completo de solicitudes de certificación</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-4 font-sans">
					<div className="rounded-2xl border border-[#2A611E] bg-[#3B7C26] p-5 text-white shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-white" />
							<span className="text-sm font-medium">Todas</span>
						</div>
						<div className="text-3xl font-bold leading-none">{mockStats.todas}</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-[#EAB308]" />
							<span className="text-sm font-medium text-gray-600">Pendientes</span>
						</div>
						<div className="text-3xl font-bold leading-none text-gray-900">{mockStats.pendientes}</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-[#22C55E]" />
							<span className="text-sm font-medium text-gray-600">Aprobadas</span>
						</div>
						<div className="text-3xl font-bold leading-none text-gray-900">{mockStats.aprobadas}</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-[#EF4444]" />
							<span className="text-sm font-medium text-gray-600">Rechazadas</span>
						</div>
						<div className="text-3xl font-bold leading-none text-gray-900">{mockStats.rechazadas}</div>
					</div>
				</div>

				<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm font-sans">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
						<div className="relative flex-1">
							<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Buscar por ID, animal, productor, rancho o raza..."
								className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15"
							/>
						</div>

						<div className="flex items-center gap-2 lg:w-auto">
							<button className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50">
								<Filter className="h-4 w-4" />
							</button>

							<div className="relative min-w-[140px]">
								<select
									value={razaFilter}
									onChange={(event) => setRazaFilter(event.target.value)}
									className="w-full appearance-none rounded-xl border border-[#2E6B2C] bg-white px-4 py-3 pr-10 text-sm text-[#111827] outline-none shadow-sm focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15"
								>
									{razaOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
								<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
							</div>

							<button className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-50">
								<Filter className="h-4 w-4" />
							</button>

							<div className="relative min-w-[140px]">
								<select
									value={tipoFilter}
									onChange={(event) => setTipoFilter(event.target.value)}
									className="w-full appearance-none rounded-xl border border-[#2E6B2C] bg-white px-4 py-3 pr-10 text-sm text-[#111827] outline-none shadow-sm focus:border-[#2E6B2C] focus:ring-2 focus:ring-[#2E6B2C]/15"
								>
									{tipoOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
								<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
							</div>

							{filtrosActivos && (
								<button
									onClick={limpiarFiltros}
									className="inline-flex items-center gap-2 text-sm font-medium text-[#2E6B2C] hover:text-[#235322]"
								>
									<X className="h-4 w-4" />
									Limpiar filtros
								</button>
							)}
						</div>
					</div>

				</div>

				<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm font-sans">
					<div className="overflow-x-auto">
						<table className="w-full min-w-[1200px] text-left text-sm text-[#243145]">
							<thead className="border-b border-gray-200 bg-gray-50/60 text-[12px] font-semibold text-[#1F2937]">
								<tr>
									<th className="px-6 py-4">Solicitud</th>
									<th className="px-6 py-4">Animal</th>
									<th className="px-6 py-4">Tipo</th>
									<th className="px-6 py-4">Productor</th>
									<th className="px-6 py-4">Rancho</th>
									<th className="px-6 py-4">Raza</th>
									<th className="px-6 py-4">Edad</th>
									<th className="px-6 py-4">Peso Est.</th>
									<th className="px-6 py-4">Fecha</th>
									<th className="px-6 py-4">Estado</th>
									<th className="px-6 py-4 text-center">Acciones</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-gray-100">
								{filteredSolicitudes.map((solicitud) => (
									<tr key={solicitud.id} className="hover:bg-[#FBFBF8] transition-colors">
										<td className="px-6 py-5 font-bold text-[#111827]">{solicitud.id}</td>
										<td className="px-6 py-5">{solicitud.animal}</td>
										<td className="px-6 py-5">{solicitud.tipo}</td>
										<td className="px-6 py-5">{solicitud.productor}</td>
										<td className="px-6 py-5">{solicitud.rancho}</td>
										<td className="px-6 py-5">{solicitud.raza}</td>
										<td className="px-6 py-5">{solicitud.edad}</td>
										<td className="px-6 py-5">{solicitud.peso}</td>
										<td className="px-6 py-5">{solicitud.fecha}</td>
										<td className="px-6 py-5">{getEstadoBadge(solicitud.estado)}</td>
										<td className="px-6 py-5">
											<div className="flex justify-center">
												{solicitud.estado === 'Pendiente' ? (
													<button
														onClick={() => abrirRevision(solicitud)}
														className="inline-flex items-center gap-2 rounded-xl border border-[#1F5E16] bg-[#2E6B2C] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#235322]"
													>
														<Eye className="h-4 w-4" />
														Revisar
													</button>
												) : solicitud.estado === 'Rechazada' ? (
													<button
														onClick={() => abrirRechazada(solicitud)}
														className="inline-flex items-center gap-2 rounded-xl border border-[#C9D3E2] bg-white px-4 py-2 text-xs font-semibold text-[#2E3B55] shadow-sm transition-colors hover:bg-[#F8FAFC]"
													>
														<Eye className="h-4 w-4" />
														Ver
													</button>
												) : solicitud.estado === 'Aprobada' ? (
													<button
														onClick={() => abrirAprobada(solicitud)}
														className="inline-flex items-center gap-2 rounded-xl border border-[#BFDCC7] bg-white px-4 py-2 text-xs font-semibold text-[#1E7A39] shadow-sm transition-colors hover:bg-[#F3FBF5]"
													>
														<Eye className="h-4 w-4" />
														Ver
													</button>
												) : (
													<button className="inline-flex items-center gap-2 rounded-xl border border-[#C9D3E2] bg-white px-4 py-2 text-xs font-semibold text-[#2E3B55] shadow-sm transition-colors hover:bg-[#F8FAFC]">
														<Eye className="h-4 w-4" />
														Ver
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-[#3B4658]">
						Mostrando <span className="font-bold text-[#111827]">{totalMostrados}</span> de <span className="font-bold text-[#111827]">{mockSolicitudes.length}</span> solicitudes
					</div>
				</div>

				<RevisionCertificacionModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					solicitud={solicitudSeleccionada}
				/>

				<RevisionCertificacionRechazada
					isOpen={isRejectedModalOpen}
					onClose={() => setIsRejectedModalOpen(false)}
					solicitud={solicitudRechazadaSeleccionada}
				/>

				<RevisionCertificacionAprobada
					isOpen={isApprovedModalOpen}
					onClose={() => setIsApprovedModalOpen(false)}
					solicitud={solicitudAprobadaSeleccionada}
				/>
			</div>
		</div>
	);
}
