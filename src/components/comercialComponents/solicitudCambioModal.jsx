import { useState } from 'react';
import { Clock, X } from 'lucide-react';

export default function SolicitudesCambioModal({ isOpen, onClose }) {
	const [filtro, setFiltro] = useState('Todos');

	const solicitudes = [];
	const solicitudesFiltradas = filtro === 'Todos' ? solicitudes : solicitudes.filter((solicitud) => solicitud.estado === filtro);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm" onClick={onClose}>
			<div className="flex w-full max-w-170 flex-col overflow-hidden rounded-[22px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
					<div className="flex items-center gap-3">
						<Clock className="h-5 w-5 text-[#2E6B2C]" />
						<h2 className="text-[24px] font-bold text-[#111827]">Solicitudes de Cambio</h2>
					</div>
					<button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Cerrar modal">
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="border-b border-gray-200 px-6 pt-4 font-sans">
					<div className="flex flex-wrap gap-3">
						{['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map((option) => (
							<button
								key={option}
								onClick={() => setFiltro(option)}
								className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
									filtro === option ? 'border-[#2E6B2C] text-[#2E6B2C]' : 'border-transparent text-gray-500 hover:text-gray-700'
								}`}
							>
								{option === 'Pendiente' ? 'Pendientes' : option === 'Aprobado' ? 'Aprobadas' : option === 'Rechazado' ? 'Rechazadas' : 'Todas'}
							</button>
						))}
					</div>
				</div>

				<div className="flex flex-1 items-center justify-center px-6 py-14 font-sans">
					{solicitudesFiltradas.length === 0 ? (
						<div className="flex flex-col items-center gap-4 text-center text-[#5C6470]">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F3F4F6] text-[#9CA3AF]">
								<Clock className="h-8 w-8" />
							</div>
							<p className="text-lg font-medium text-[#4B5563]">No hubo solicitudes de cambios</p>
						</div>
					) : (
						<div className="w-full space-y-4">
							{solicitudesFiltradas.map((solicitud) => (
								<div key={solicitud.id}>{solicitud.campo}</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}