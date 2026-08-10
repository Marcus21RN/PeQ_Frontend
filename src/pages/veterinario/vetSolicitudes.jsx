import { useMemo, useState, useEffect } from 'react';
import { Search, Filter, Eye, ChevronDown, X } from 'lucide-react';

import RevisionCertificacionModal from '../../components/veterinarioComponents/revisionCertificacionModal.jsx';
// Importación de tu API (Asegúrate de que la ruta sea correcta)
import { getTodasLasSolicitudes } from '../../services/apiVeterinario/solicitudesPanel.js';

const razaOptions = ['Todas las razas', 'Angus', 'Brahman', 'Charolais', 'Duroc', 'Hereford', 'Holstein'];
const tipoOptions = ['Todos los tipos', 'Bovino', 'Porcino'];

export default function VetSolicitudes() {
	const [rawSolicitudes, setRawSolicitudes] = useState([]);
	const [loading, setLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState('');
	const [razaFilter, setRazaFilter] = useState('Todas las razas');
	const [tipoFilter, setTipoFilter] = useState('Todos los tipos');
	
	// Estado centralizado para el único Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

	useEffect(() => {
		const fetchSolicitudes = async () => {
			try {
				setLoading(true);
				const data = await getTodasLasSolicitudes();
				setRawSolicitudes(data);
			} catch (error) {
				console.error("Error al cargar las solicitudes:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSolicitudes();
	}, []);

	// Cálculo de estadísticas dinámico basado en los datos reales
	const stats = useMemo(() => {
		return {
			todas: rawSolicitudes.length,
			pendientes: rawSolicitudes.filter(s => s.estado_solicitud === 'Pendiente').length,
			aprobadas: rawSolicitudes.filter(s => s.estado_solicitud === 'Aprobada').length,
			rechazadas: rawSolicitudes.filter(s => s.estado_solicitud === 'Rechazada').length,
		};
	}, [rawSolicitudes]);

	const filteredSolicitudes = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();

		return rawSolicitudes.filter((solicitud) => {
			const matchesSearch = !normalizedQuery || [
				solicitud.codigo_solicitud, solicitud.arete_animal, solicitud.tipo_ganado, 
				solicitud.nombre_productor, solicitud.rancho, solicitud.raza, solicitud.estado_solicitud
			].some((value) => String(value).toLowerCase().includes(normalizedQuery));

			const matchesRaza = razaFilter === 'Todas las razas' || solicitud.raza === razaFilter;
			const matchesTipo = tipoFilter === 'Todos los tipos' || solicitud.tipo_ganado === tipoFilter;

			return matchesSearch && matchesRaza && matchesTipo;
		});
	}, [rawSolicitudes, searchQuery, razaFilter, tipoFilter]);

	const limpiarFiltros = () => {
		setSearchQuery('');
		setRazaFilter('Todas las razas');
		setTipoFilter('Todos los tipos');
	};

	// Función unificada para abrir el modal
	const abrirModal = (solicitud) => {
		setSolicitudSeleccionada(solicitud);
		setIsModalOpen(true);
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

	// Función para formatear fechas desde la base de datos
	const formatearFecha = (fechaISO) => {
		if (!fechaISO) return '';
		return new Date(fechaISO).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
	};

	const filtrosActivos = searchQuery.trim() !== '' || razaFilter !== 'Todas las razas' || tipoFilter !== 'Todos los tipos';
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
						<div className="text-3xl font-bold leading-none">{loading ? '-' : stats.todas}</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-[#EAB308]" />
							<span className="text-sm font-medium text-gray-600">Pendientes</span>
						</div>
						<div className="text-3xl font-bold leading-none text-gray-900">{loading ? '-' : stats.pendientes}</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-[#22C55E]" />
							<span className="text-sm font-medium text-gray-600">Aprobadas</span>
						</div>
						<div className="text-3xl font-bold leading-none text-gray-900">{loading ? '-' : stats.aprobadas}</div>
					</div>

					<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="mb-2 flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-[#EF4444]" />
							<span className="text-sm font-medium text-gray-600">Rechazadas</span>
						</div>
						<div className="text-3xl font-bold leading-none text-gray-900">{loading ? '-' : stats.rechazadas}</div>
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

							<div className="relative min-w-35">
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

							<div className="relative min-w-35">
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
						<table className="w-full min-w-300 text-left text-sm text-[#243145]">
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
								{loading ? (
									<tr>
										<td colSpan={11} className="px-6 py-16 text-center text-sm text-gray-500">
											Cargando solicitudes...
										</td>
									</tr>
								) : filteredSolicitudes.length > 0 ? (
									filteredSolicitudes.map((solicitud) => (
										<tr key={solicitud.id_solicitud} className="hover:bg-[#FBFBF8] transition-colors">
											<td className="px-6 py-5 font-bold text-[#111827]">{solicitud.codigo_solicitud}</td>
											<td className="px-6 py-5">{solicitud.arete_animal}</td>
											<td className="px-6 py-5">{solicitud.tipo_ganado}</td>
											<td className="px-6 py-5">{solicitud.nombre_productor}</td>
											<td className="px-6 py-5">{solicitud.rancho}</td>
											<td className="px-6 py-5">{solicitud.raza}</td>
											<td className="px-6 py-5">{solicitud.edad_anios} años</td>
											<td className="px-6 py-5">{solicitud.peso_est_kg} kg</td>
											<td className="px-6 py-5">{formatearFecha(solicitud.fecha_solicitud)}</td>
											<td className="px-6 py-5">{getEstadoBadge(solicitud.estado_solicitud)}</td>
											<td className="px-6 py-5">
												<div className="flex justify-center">
													{solicitud.estado_solicitud === 'Pendiente' ? (
														<button
															onClick={() => abrirModal(solicitud)}
															className="inline-flex items-center gap-2 rounded-xl border border-[#1F5E16] bg-[#2E6B2C] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#235322]"
														>
															<Eye className="h-4 w-4" />
															Revisar
														</button>
													) : solicitud.estado_solicitud === 'Rechazada' ? (
														<button
															onClick={() => abrirModal(solicitud)}
															className="inline-flex items-center gap-2 rounded-xl border border-[#C9D3E2] bg-white px-4 py-2 text-xs font-semibold text-[#2E3B55] shadow-sm transition-colors hover:bg-[#F8FAFC]"
														>
															<Eye className="h-4 w-4" />
															Ver
														</button>
													) : (
														<button
															onClick={() => abrirModal(solicitud)}
															className="inline-flex items-center gap-2 rounded-xl border border-[#BFDCC7] bg-white px-4 py-2 text-xs font-semibold text-[#1E7A39] shadow-sm transition-colors hover:bg-[#F3FBF5]"
														>
															<Eye className="h-4 w-4" />
															Ver
														</button>
													)}
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={11} className="px-6 py-16 text-center text-sm text-gray-500">
											No se encontraron solicitudes con los filtros actuales.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div className="border-t border-gray-200 bg-white px-6 py-4 text-sm text-[#3B4658]">
						Mostrando <span className="font-bold text-[#111827]">{totalMostrados}</span> de <span className="font-bold text-[#111827]">{rawSolicitudes.length}</span> solicitudes
					</div>
				</div>

				{/* Un solo modal para todos los estados */}
				<RevisionCertificacionModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					solicitud={solicitudSeleccionada}
				/>
			</div>
		</div>
	);
}
