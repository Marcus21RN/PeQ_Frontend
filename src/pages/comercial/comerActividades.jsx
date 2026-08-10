/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { Search, RotateCcw, Clock, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { getActividadesProductor } from '../../services/apiComercial/actividadProductor';

export default function MisActividadesComercial() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroEntidad, setFiltroEntidad] = useState('');

  // Carga de datos inicial
  useEffect(() => {
    let isMounted = true;

    getActividadesProductor()
      .then((data) => {
        if (isMounted) {
          setActividades(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        console.error('Error al cargar historial de actividades comercial:', err);
        if (isMounted) {
          setError('No se pudo obtener el historial de actividades.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Normalización estricta de texto
  const normalizar = (texto) => {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  // Filtrado local
  const actividadesFiltradas = useMemo(() => {
    if (!actividades || actividades.length === 0) return [];

    const searchClean = normalizar(busqueda);
    const entidadClean = normalizar(filtroEntidad);

    return actividades.filter((act) => {
      const accion = normalizar(act.accion);
      const entidad = normalizar(act.entidad);
      const detalles = normalizar(act.detalles);

      if (entidadClean && !entidad.includes(entidadClean)) {
        return false;
      }

      if (searchClean && !(accion.includes(searchClean) || detalles.includes(searchClean) || entidad.includes(searchClean))) {
        return false;
      }

      return true;
    });
  }, [actividades, busqueda, filtroEntidad]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroEntidad('');
  };

  const getAccionBadge = (accionRaw) => {
    const accion = normalizar(accionRaw);
    if (accion.includes('insert') || accion.includes('registr') || accion.includes('crear') || accion.includes('alta')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF3E6] text-[#387030]">Registro</span>;
    }
    if (accion.includes('update') || accion.includes('edit') || accion.includes('actualiz') || accion.includes('modific')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Edición</span>;
    }
    if (accion.includes('delete') || accion.includes('elimin') || accion.includes('baja')) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Eliminación</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{accionRaw || 'Actividad'}</span>;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-serif pb-10">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-[#3B2211]">Historial de Acciones</h1>
        <p className="text-gray-500 mt-1 font-sans text-sm">Consulta la bitácora de eventos y modificaciones realizadas en tu cuenta</p>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 font-sans shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en historial por acción o detalles..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm"
          />
        </div>
        
        <select
          value={filtroEntidad}
          onChange={(e) => setFiltroEntidad(e.target.value)}
          className="border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C743D] text-sm md:w-52 bg-white cursor-pointer"
        >
          <option value="">Todas las entidades</option>
          <option value="animal">Animales</option>
          <option value="productores">Rancho / Predio</option>
          <option value="usuarios">Perfil / Usuario</option>
          <option value="documentos">Documentos</option>
        </select>
        
        <button 
          onClick={limpiarFiltros}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Limpiar
        </button>
      </div>

      {/* Tabla de Bitácora */}
      <div className="bg-[#FDFDFB] border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-[#F7F8F3] border-b border-[#E8ECE1] text-xs font-bold text-[#3B2211] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Entidad Afectada</th>
                <th className="px-6 py-4">Detalles del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECE1]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Cargando historial de actividades...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-red-600">{error}</td>
                </tr>
              ) : actividadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No se encontraron registros de actividades.</td>
                </tr>
              ) : (
                actividadesFiltradas.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>
                        {item.fecha_hora 
                          ? new Date(item.fecha_hora).toLocaleString('es-MX', {
                              dateStyle: 'short',
                              timeStyle: 'medium',
                            })
                          : 'Reciente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getAccionBadge(item.accion)}</td>
                    <td className="px-6 py-4 font-bold text-[#3B2211] capitalize font-serif">{item.entidad || 'General'}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{item.detalles || 'Sin detalles registrados'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen de Actividad Inferior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-serif">Total de Acciones</p>
            <p className="text-3xl font-bold text-[#3B2211] font-serif mt-1">{actividades.length}</p>
          </div>
          <div className="p-3 bg-[#F4F6F0] rounded-xl text-[#387030]">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-serif">Última Modificación</p>
            <p className="text-base font-bold text-[#387030] font-serif mt-1">
              {actividades.length > 0 && actividades[0].fecha_hora
                ? new Date(actividades[0].fecha_hora).toLocaleDateString('es-MX')
                : 'Sin registros'}
            </p>
          </div>
          <div className="p-3 bg-[#EAF3E6] rounded-xl text-[#387030]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-serif">Entidades Afectadas</p>
            <p className="text-3xl font-bold text-[#3B2211] font-serif mt-1">
              {new Set(actividades.map((a) => a.entidad)).size}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

    </div>
  );
}