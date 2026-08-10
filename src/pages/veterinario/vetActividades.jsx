import { useMemo, useState, useEffect } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getBitacoraCambios } from '../../services/apiVeterinario/solicitudesPanel.js';

const PAGE_SIZE = 10;

const actionMeta = {
	Todos: { label: 'Todas', color: 'bg-[#2F6E2D]', dot: 'bg-white', text: 'text-white', border: 'border-[#225620]' },
	Crear: { label: 'Creaciones', color: 'bg-white', dot: 'bg-[#22C55E]', text: 'text-[#111827]', border: 'border-gray-200' },
	Actualizar: { label: 'Actualizaciones', color: 'bg-white', dot: 'bg-[#3B82F6]', text: 'text-[#111827]', border: 'border-gray-200' },
	Desactivar: { label: 'Desactivaciones', color: 'bg-white', dot: 'bg-[#F59E0B]', text: 'text-[#111827]', border: 'border-gray-200' },
};

const formatDateTime = (dateTime) => {
	const date = new Date(dateTime);
	const dateFormatter = new Intl.DateTimeFormat('es-MX', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
	const timeFormatter = new Intl.DateTimeFormat('es-MX', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});

	const formattedDate = dateFormatter.format(date).replace('.', '');
	const formattedTime = timeFormatter.format(date).replace('a. m.', 'a.m.').replace('p. m.', 'p.m.');

	return {
		dateLabel: formattedDate,
		timeLabel: formattedTime,
		searchValue: `${formattedDate} ${formattedTime}`.toLowerCase(),
		dateOnly: date.toISOString().slice(0, 10),
	};
};

const getAccionBadge = (accion) => {
	switch (accion) {
		case 'Crear':
			return <span className="inline-flex rounded-full bg-[#DFF8E7] px-3 py-1 text-[11px] font-medium text-[#1E7A39]">Crear</span>;
		case 'Actualizar':
			return <span className="inline-flex rounded-full bg-[#DCE9FF] px-3 py-1 text-[11px] font-medium text-[#2451B7]">Actualizar</span>;
		case 'Desactivar':
			return <span className="inline-flex rounded-full bg-[#FEF1B9] px-3 py-1 text-[11px] font-medium text-[#9A6A00]">Desactivar</span>;
		default:
			return <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-700">{accion}</span>;
	}
};

export default function VetActividades() {
	const [rawActivities, setRawActivities] = useState([]);
	const [loading, setLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [actionFilter, setActionFilter] = useState('Todos');
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const fetchActividades = async () => {
			try {
				setLoading(true);
				const data = await getBitacoraCambios();
				setRawActivities(data);
			} catch (error) {
				console.error("Error al obtener actividades:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchActividades();
	}, []);

	const activities = useMemo(
		() =>
			rawActivities.map((activity, index) => ({
				...activity,
				id_temporal: index, // Usamos el índice como key temporal en caso de que el backend no envíe ID
				...formatDateTime(activity.fecha_hora),
				searchBlob: `${activity.tipo_accion} ${activity.entidad_afectada} ${activity.detalles}`.toLowerCase(),
			})),
		[rawActivities]
	);

	const stats = useMemo(() => {
		return {
			todas: activities.length,
			creaciones: activities.filter((activity) => activity.tipo_accion === 'Crear').length,
			actualizaciones: activities.filter((activity) => activity.tipo_accion === 'Actualizar').length,
			desactivaciones: activities.filter((activity) => activity.tipo_accion === 'Desactivar').length,
		};
	}, [activities]);

	const filteredActivities = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase();
		const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
		const end = endDate ? new Date(`${endDate}T23:59:59`) : null;

		return activities.filter((activity) => {
			const matchesAction = actionFilter === 'Todos' || activity.tipo_accion === actionFilter;
			const matchesSearch = !normalizedQuery || activity.searchBlob.includes(normalizedQuery);
			const activityDate = new Date(activity.fecha_hora);
			const matchesStart = !start || activityDate >= start;
			const matchesEnd = !end || activityDate <= end;

			return matchesAction && matchesSearch && matchesStart && matchesEnd;
		});
	}, [activities, actionFilter, searchQuery, startDate, endDate]);

	const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
	const safeCurrentPage = Math.min(currentPage, totalPages);
	const paginatedActivities = filteredActivities.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
	const startItem = filteredActivities.length === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
	const endItem = Math.min(safeCurrentPage * PAGE_SIZE, filteredActivities.length);
	const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

	const hasFilters = searchQuery || startDate || endDate || actionFilter !== 'Todos';

	const updateActionFilter = (nextAction) => {
		setActionFilter(nextAction);
		setCurrentPage(1);
	};

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1);
	};

	const handleStartDateChange = (event) => {
		setStartDate(event.target.value);
		setCurrentPage(1);
	};

	const handleEndDateChange = (event) => {
		setEndDate(event.target.value);
		setCurrentPage(1);
	};

	const limpiarFiltros = () => {
		setSearchQuery('');
		setStartDate('');
		setEndDate('');
		setActionFilter('Todos');
		setCurrentPage(1);
	};

	return (
		<div className="min-h-[calc(100vh-2rem)] bg-[#F7F7F4] px-4 py-4 md:px-6 md:py-6 font-serif">
			<div className="mx-auto max-w-7xl space-y-8">
				<div className="space-y-2">
					<h1 className="text-[28px] font-bold text-[#111827] md:text-[34px]">Mis Actividades</h1>
					<p className="text-sm text-[#5C6470] font-sans">Revisa tu historial de acciones en el sistema</p>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-4 font-sans">
					{[
						['Todos', stats.todas],
						['Crear', stats.creaciones],
						['Actualizar', stats.actualizaciones],
						['Desactivar', stats.desactivaciones],
					].map(([key, value]) => {
						const meta = actionMeta[key];
						const isSelected = actionFilter === key;

						return (
							<button
								key={key}
								onClick={() => updateActionFilter(key)}
								className={`rounded-2xl border p-5 text-left shadow-sm transition-transform duration-200 hover:-translate-y-0.5 ${
									isSelected && key === 'Todos'
										? 'bg-[#2F6E2D] border-[#255822] text-white'
										: 'bg-white border-gray-200 hover:bg-[#FBFBF8]'
								}`}
							>
								<div className="mb-2 flex items-center gap-2">
									<span className={`h-2.5 w-2.5 rounded-full ${isSelected && key === 'Todos' ? 'bg-white' : meta.dot}`} />
									<span className={`text-sm font-medium ${isSelected && key === 'Todos' ? 'text-white' : 'text-[#6B7280]'}`}>{meta.label}</span>
								</div>
								<div className={`text-[28px] font-bold leading-none ${isSelected && key === 'Todos' ? 'text-white' : 'text-[#111827]'}`}>
									{loading ? '-' : value}
								</div>
							</button>
						);
					})}
				</div>

				<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm font-sans md:p-5 space-y-4">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-center">
						<div className="relative flex-1">
							<Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={handleSearchChange}
								placeholder="Buscar por detalles de la actividad..."
								className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-[#2F6E2D] focus:ring-2 focus:ring-[#2F6E2D]/15"
							/>
						</div>

						<div className="flex flex-wrap items-center gap-3 lg:w-auto">
							<div className="flex items-center gap-2">
								<CalendarDays className="h-5 w-5 text-gray-400" />
								<div className="relative">
									<input
										type="date"
										value={startDate}
										onChange={handleStartDateChange}
										className="w-37.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#2F6E2D] focus:ring-2 focus:ring-[#2F6E2D]/15"
									/>
								</div>
							</div>

							<span className="text-sm text-gray-500">hasta</span>

							<div className="relative">
								<input
									type="date"
									value={endDate}
									onChange={handleEndDateChange}
									className="w-37.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#2F6E2D] focus:ring-2 focus:ring-[#2F6E2D]/15"
								/>
							</div>

							{hasFilters && (
								<button
									onClick={limpiarFiltros}
									className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-[#2F6E2D] transition-colors hover:bg-[#F4FAF2]"
								>
									Limpiar filtros
								</button>
							)}
						</div>
					</div>

					<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full min-w-250 text-left text-sm text-[#243145]">
								<thead className="border-b border-gray-200 bg-gray-50/60 text-[12px] font-semibold text-[#1F2937]">
									<tr>
										<th className="px-6 py-4">
											<div className="flex items-center gap-1">Fecha/Hora <ChevronDown className="h-3 w-3 text-[#2F6E2D]" /></div>
										</th>
										<th className="px-6 py-4">
											<div className="flex items-center gap-1">Acción <ChevronDown className="h-3 w-3 text-gray-400" /></div>
										</th>
										<th className="px-6 py-4">Entidad</th>
										<th className="px-6 py-4">Detalles</th>
									</tr>
								</thead>

								<tbody className="divide-y divide-gray-100">
									{loading ? (
										<tr>
											<td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-500">
												Cargando actividades...
											</td>
										</tr>
									) : paginatedActivities.length > 0 ? (
										paginatedActivities.map((activity) => (
											<tr key={activity.id_temporal} className="transition-colors hover:bg-[#FBFBF8]">
												<td className="px-6 py-5 whitespace-nowrap text-[#263042]">
													<div>
														<div>{activity.dateLabel} {activity.timeLabel}</div>
													</div>
												</td>
												<td className="px-6 py-5">{getAccionBadge(activity.tipo_accion)}</td>
												<td className="px-6 py-5 text-[#263042]">{activity.entidad_afectada}</td>
												<td className="px-6 py-5 text-[#263042]">
													<div className="max-w-130 leading-relaxed">{activity.detalles}</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={4} className="px-6 py-16 text-center text-sm text-gray-500">
												No se encontraron actividades con los filtros actuales.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-4 text-sm text-[#3B4658] md:flex-row md:px-6">
							<div>
								Mostrando <span className="font-bold text-[#111827]">{startItem} a {endItem}</span> de <span className="font-bold text-[#111827]">{filteredActivities.length}</span> actividades
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
									disabled={safeCurrentPage === 1 || loading}
									className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
								>
									<ChevronLeft className="h-4 w-4" /> Anterior
								</button>

								{pageNumbers.map((pageNumber) => (
									<button
										key={pageNumber}
										onClick={() => setCurrentPage(pageNumber)}
										className={`h-9 w-9 rounded-lg border text-sm font-medium transition-colors ${
											safeCurrentPage === pageNumber
												? 'border-[#2F6E2D] bg-[#2F6E2D] text-white shadow-sm'
												: 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
										}`}
									>
										{pageNumber}
									</button>
								))}

								<button
									onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
									disabled={safeCurrentPage === totalPages || loading || totalPages === 0}
									className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
								>
									Siguiente <ChevronRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
