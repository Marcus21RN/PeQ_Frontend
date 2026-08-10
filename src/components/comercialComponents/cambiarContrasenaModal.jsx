/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { X, Lock, CheckCircle, AlertCircle, Eye, EyeOff, Check, X as Cross } from 'lucide-react';

// IMPORTACIÓN DESDE EL NUEVO ARCHIVO APARTE DE SERVICIO
import { cambiarContrasenaProductor } from '../../services/apiTraspatio/cambiarContrasena';

export default function ModalCambiarContraseña({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    contrasena_actual: '',
    contrasena_nueva: '',
    confirmar_contrasena: '',
  });

  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleModalClose = () => {
    setError(null);
    setExito(false);
    setFormData({ contrasena_actual: '', contrasena_nueva: '', confirmar_contrasena: '' });
    setShowActual(false);
    setShowNueva(false);
    setShowConfirmar(false);
    onClose();
  };

  const reglasNueva = {
    longitud: formData.contrasena_nueva.length >= 6,
    mayuscula: /[A-Z]/.test(formData.contrasena_nueva),
    minuscula: /[a-z]/.test(formData.contrasena_nueva),
    numero: /[0-9]/.test(formData.contrasena_nueva),
  };

  const todasLasReglasCumplidas = Object.values(reglasNueva).every(Boolean);
  const coincidenContrasenas = formData.contrasena_nueva === formData.confirmar_contrasena && formData.confirmar_contrasena.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.contrasena_actual) {
      setError('Por favor ingresa tu contraseña actual.');
      return;
    }

    if (!todasLasReglasCumplidas) {
      setError('La nueva contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    if (!coincidenContrasenas) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      // LLAMADA AL SERVICIO INDEPENDIENTE
      await cambiarContrasenaProductor({
        contrasena_actual: formData.contrasena_actual,
        contrasena_nueva: formData.contrasena_nueva,
      });

      setExito(true);
      setTimeout(() => {
        handleModalClose();
      }, 1800);
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      const msg = err.response?.data?.detail || 'No se pudo actualizar la contraseña. Verifica tus datos.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#387030]" />
            <h2 className="font-serif text-xl font-bold text-[#3B2211]">Cambiar Contraseña</h2>
          </div>
          <button onClick={handleModalClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notificación de Éxito o Formulario */}
        {exito ? (
          <div className="my-8 text-center space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 animate-bounce" />
            <p className="font-serif text-lg font-bold text-gray-800">¡Contraseña Actualizada!</p>
            <p className="text-xs text-gray-500">Se ejecutó la actualización en la base de datos.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Contraseña Actual */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña Actual</label>
              <div className="relative">
                <input
                  type={showActual ? 'text' : 'password'}
                  name="contrasena_actual"
                  value={formData.contrasena_actual}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 pl-3.5 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                />
                <button
                  type="button"
                  onClick={() => setShowActual(!showActual)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showActual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showNueva ? 'text' : 'password'}
                  name="contrasena_nueva"
                  value={formData.contrasena_nueva}
                  onChange={handleChange}
                  placeholder="Crea tu nueva contraseña"
                  className="w-full rounded-lg border border-gray-200 pl-3.5 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                />
                <button
                  type="button"
                  onClick={() => setShowNueva(!showNueva)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showNueva ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Indicadores en tiempo real */}
              <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-lg bg-gray-50 p-3 text-xs font-medium">
                <div className={`flex items-center gap-1.5 ${reglasNueva.longitud ? 'text-green-700' : 'text-gray-400'}`}>
                  {reglasNueva.longitud ? <Check className="h-3.5 w-3.5" /> : <Cross className="h-3.5 w-3.5" />}
                  Mínimo 6 caracteres
                </div>
                <div className={`flex items-center gap-1.5 ${reglasNueva.mayuscula ? 'text-green-700' : 'text-gray-400'}`}>
                  {reglasNueva.mayuscula ? <Check className="h-3.5 w-3.5" /> : <Cross className="h-3.5 w-3.5" />}
                  Una mayúscula (A-Z)
                </div>
                <div className={`flex items-center gap-1.5 ${reglasNueva.minuscula ? 'text-green-700' : 'text-gray-400'}`}>
                  {reglasNueva.minuscula ? <Check className="h-3.5 w-3.5" /> : <Cross className="h-3.5 w-3.5" />}
                  Una minúscula (a-z)
                </div>
                <div className={`flex items-center gap-1.5 ${reglasNueva.numero ? 'text-green-700' : 'text-gray-400'}`}>
                  {reglasNueva.numero ? <Check className="h-3.5 w-3.5" /> : <Cross className="h-3.5 w-3.5" />}
                  Un número (0-9)
                </div>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  name="confirmar_contrasena"
                  value={formData.confirmar_contrasena}
                  onChange={handleChange}
                  placeholder="Repite la nueva contraseña"
                  className={`w-full rounded-lg border pl-3.5 pr-10 py-2.5 text-sm outline-none focus:ring-2 ${
                    formData.confirmar_contrasena.length > 0
                      ? coincidenContrasenas
                        ? 'border-green-300 focus:ring-green-500'
                        : 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-[#5C743D]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.confirmar_contrasena.length > 0 && (
                <p className={`mt-1 text-[11px] font-semibold ${coincidenContrasenas ? 'text-green-600' : 'text-red-500'}`}>
                  {coincidenContrasenas ? '✓ Las contraseñas coinciden' : '✕ Las contraseñas no coinciden'}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleModalClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !todasLasReglasCumplidas || !coincidenContrasenas || !formData.contrasena_actual}
                className="rounded-lg bg-[#387030] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#2c5726] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}