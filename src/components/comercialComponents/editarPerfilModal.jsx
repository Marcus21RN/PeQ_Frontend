/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { X, User, Home, AlertCircle, CheckCircle } from 'lucide-react';
import { editarPerfilProductor } from '../../services/apiTraspatio/editarPerfilProductor';

export default function ModalEditarPerfilProductor({ isOpen, onClose, perfilActual, onActualizado }) {
  // Desglosar nombre del perfil directamente
  const nombreCompleto = perfilActual?.nombre_completo || perfilActual?.nombreCompleto || perfilActual?.nombre || '';
  const partes = nombreCompleto.trim().split(/\s+/);

  const nombreInicial = perfilActual?.nombre || partes[0] || '';
  const apePaternoInicial = perfilActual?.apellido_paterno || perfilActual?.apellidoPaterno || partes[1] || '';
  const apeMaternoInicial = perfilActual?.apellido_materno || perfilActual?.apellidoMaterno || (partes.length > 2 ? partes.slice(2).join(' ') : '');

  // Inicializar estado directamente sin useEffect
  const [formData, setFormData] = useState(() => ({
    nombre: nombreInicial,
    apellido_paterno: apePaternoInicial,
    apellido_materno: apeMaternoInicial,
    email: perfilActual?.email || perfilActual?.correo || '',
    telefono: perfilActual?.telefono || '',
    ciudad: perfilActual?.municipio || perfilActual?.ciudad || perfilActual?.municipio_ciudad || '',
    nombre_rancho: perfilActual?.nombre_rancho || perfilActual?.nombreRancho || perfilActual?.rancho || '',
    direccion: perfilActual?.direccion || '',
    capacidad_animales: perfilActual?.capacidad_animales ?? perfilActual?.capacidadAnimales ?? 0,
    superficie_hectareas: perfilActual?.superficie_hectareas ?? perfilActual?.superficieHectareas ?? 0,
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await editarPerfilProductor({
        ...formData,
        capacidad_animales: Number(formData.capacidad_animales) || 0,
        superficie_hectareas: Number(formData.superficie_hectareas) || 0,
        documentos: [],
      });

      setExito(true);
      setTimeout(() => {
        setExito(false);
        if (onActualizado) onActualizado();
        onClose();
      }, 1600);
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err.response?.data?.detail || 'No se pudo actualizar el perfil. Revisa la información ingresada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#387030]" />
            <h2 className="font-serif text-xl font-bold text-[#3B2211]">Editar Perfil del Productor</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {exito ? (
          <div className="my-10 text-center space-y-3">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600 animate-bounce" />
            <p className="font-serif text-lg font-bold text-gray-800">¡Perfil Actualizado!</p>
            <p className="text-xs text-gray-500">Los cambios se guardaron correctamente y tu estado pasó a Pendiente de revisión.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SECCIÓN 1: Datos Personales */}
            <div>
              <h3 className="font-serif text-sm font-bold text-[#3B2211] mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                <User className="h-4 w-4 text-[#5C743D]" /> Datos Personales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Apellido Paterno</label>
                  <input
                    type="text"
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Apellido Materno</label>
                  <input
                    type="text"
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Datos del Rancho */}
            <div>
              <h3 className="font-serif text-sm font-bold text-[#3B2211] mb-3 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                <Home className="h-4 w-4 text-[#5C743D]" /> Datos del Rancho / Predio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre del Rancho</label>
                  <input
                    type="text"
                    name="nombre_rancho"
                    value={formData.nombre_rancho}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Capacidad de Animales</label>
                  <input
                    type="number"
                    name="capacidad_animales"
                    value={formData.capacidad_animales}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Superficie (Hectáreas)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="superficie_hectareas"
                    value={formData.superficie_hectareas}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5C743D]"
                  />
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[#387030] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#2c5726] disabled:opacity-50"
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