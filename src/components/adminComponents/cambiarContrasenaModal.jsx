import { useState } from 'react';
import { Eye, EyeOff, X, ShieldCheck } from 'lucide-react';

export default function CambiarContrasenaModal({ isOpen, onClose }) {
	const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' });
	const [showActual, setShowActual] = useState(false);
	const [showNueva, setShowNueva] = useState(false);
	const [showConfirmar, setShowConfirmar] = useState(false);
	const [error, setError] = useState('');

	if (!isOpen) return null;

	const handleSubmit = (event) => {
		event.preventDefault();

		if (form.nueva.length < 8) {
			setError('La nueva contraseña debe tener al menos 8 caracteres.');
			return;
		}

		if (form.nueva !== form.confirmar) {
			setError('Las contraseñas no coinciden.');
			return;
		}

		setError('');
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
			<div className="flex w-full max-w-md flex-col overflow-hidden rounded-[22px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
					<h2 className="text-[24px] font-bold text-[#111827]">Cambiar Contraseña</h2>
					<button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Cerrar modal">
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
					<div className="rounded-2xl border border-[#B9E3A9] bg-[#DFF5CF] px-4 py-4 text-[#245822]">
						<div className="flex items-start gap-3">
							<ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
							<p className="text-sm leading-6">El cambio de contraseña se aplica de forma inmediata sin necesidad de aprobación.</p>
						</div>
					</div>

					{error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

					{[
						{ label: 'Contraseña Actual *', key: 'actual', visible: showActual, toggle: () => setShowActual((value) => !value) },
						{ label: 'Nueva Contraseña *', key: 'nueva', visible: showNueva, toggle: () => setShowNueva((value) => !value), placeholder: 'Mínimo 8 caracteres' },
						{ label: 'Confirmar Nueva Contraseña *', key: 'confirmar', visible: showConfirmar, toggle: () => setShowConfirmar((value) => !value), placeholder: 'Repite la nueva contraseña' },
					].map((field) => (
						<div key={field.key} className="space-y-2">
							<label className="text-xs font-medium text-[#374151]">{field.label}</label>
							<div className="relative">
								<input
									type={field.visible ? 'text' : 'password'}
									required
									value={form[field.key]}
									onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
									placeholder={field.placeholder}
									className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm text-[#111827] outline-none transition-colors placeholder:text-gray-400 focus:border-[#5A3B2A] focus:ring-2 focus:ring-[#5A3B2A]/15"
								/>
								<button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
									{field.visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>
						</div>
					))}

					<div className="flex gap-3 pt-2">
						<button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-[#111827] transition-colors hover:bg-gray-50">
							Cancelar
						</button>
						<button type="submit" className="flex-1 rounded-xl bg-[#5A3B2A] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4A2F22]">
							Actualizar Contraseña
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}