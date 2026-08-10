
// src/pages/comercial/MisActividades.jsx
import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { getActividadProductor } from '../../services/apiTraspatio/actividadProductor';

export default function MisActividades() {
  // Estado para la API de actividades
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros en cliente
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Cargar actividades al montar el componente
  useEffect(() => {
    const fetchActividades = async () => {
      setLoading(true);
      try {
        const data = await getActividadProductor({ skip: 0, limit: 200 });
        setActividades(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error cargando actividades:', err);
        setActividades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, []);

  // Debounce para el campo de texto de búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  // Filtrado dinámico local de los registros devueltos por el backend
  const actividadesFiltradas = useMemo(() => {
    if (!actividades || actividades.length === 0) return [];

    return actividades.filter((act) => {
      const detalles = (act.detalles || '').toLowerCase();
      const entidad = (act.entidad || '').toLowerCase();
      const accion = (act.accion || '').toLowerCase();

      // Filtro por texto
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        if (!detalles.includes(q) && !entidad.includes(q) && !accion.includes(q)) {
          return false;
        }
      }

      // Filtro por rango de fechas
      if (act.fecha_hora) {
        const fechaAct = new Date(act.fecha_hora);
        if (dateFrom) {
          const desde = new Date(dateFrom);
          if (fechaAct < desde) return false;
        }
        if (dateTo) {
          const hasta = new Date(dateTo);
          hasta.setHours(23, 59, 59, 999);
          if (fechaAct > hasta) return false;
        }
      }

      return true;
    });
  }, [actividades, debouncedSearch, dateFrom, dateTo]);

  // Badge según tipo de acción del backend
  const getAccionBadge = (accion) => {
    const a = (accion || '').toString().toLowerCase();
    if (a.includes('cre') || a.includes('insert') || a === 'create') {
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Crear</span>;
    }
    if (a.includes('act') || a.includes('mod') || a === 'update') {
      return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Actualizar</span>;
    }
    if (a.includes('des') || a.includes('elim') || a === 'delete') {
      return <span className="bg-[#FFF4D2] text-[#8B6E00] px-3 py-1 rounded-full text-xs font-medium">Desactivar</span>;
    }
    return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{accion || 'N/A'}</span>;
  };

  // Cálculo dinámico de contadores KPI sobre los datos reales del backend
  const stats = useMemo(() => {
    const total = actividades.length;
    let creaciones = 0;
    let actualizaciones = 0;
    let desactivaciones = 0;

    actividades.forEach((a) => {
      const acc = (a.accion || '').toLowerCase();
      if (acc.includes('cre') || acc.includes('insert') || acc === 'create') creaciones++;
      else if (acc.includes('act') || acc.includes('mod') || acc === 'update') actualizaciones++;
      else if (acc.includes('des') || acc.includes('elim') || acc === 'delete') desactivaciones++;
    });

    return { total, creaciones, actualizaciones, desactivaciones };
  }, [actividades]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-serif pb-10">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Actividades</h1>
        <p className="text-gray-500 mt-2 font-sans">Revisa tu historial de acciones en el sistema</p>
      </div>

      {/* Tarjetas KPI Reales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
        
        {/* Todas */}
        <div className="bg-[#427D32] text-white p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm font-medium">Todas</span>
          </div>
          <span className="text-3xl font-bold">{stats.total}</span>
        </div>
        
        {/* Creaciones */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Creaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.creaciones}</span>
        </div>

        {/* Actualizaciones */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-600">Actualizaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.actualizaciones}</span>
        </div>

        {/* Desactivaciones */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
            <span className="text-sm font-medium text-gray-600">Desactivaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.desactivaciones}</span>
        </div>
      </div>

      {/* Buscador y Rango de Fechas */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 font-sans shadow-sm">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text" 
            placeholder="Buscar por entidad o detalles..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm" 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            type="date" 
            className="flex-1 md:w-40 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm text-gray-600 bg-white"
          />
          <span className="text-gray-400 text-sm">hasta</span>
          <input 
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            type="date" 
            className="flex-1 md:w-40 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm text-gray-600 bg-white"
          />
        </div>

      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-[#F9FAFB] border-b border-gray-100 text-xs font-bold text-gray-700">
              <tr>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-1">
                    Fecha/Hora <ChevronDown className="h-3 w-3 text-gray-500" />
                  </div>
                </th>
                <th className="px-6 py-5">Acción</th>
                <th className="px-6 py-5">Entidad</th>
                <th className="px-6 py-5">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Cargando actividades...</td>
                </tr>
              ) : actividadesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No se encontraron actividades registradas.</td>
                </tr>
              ) : (
                actividadesFiltradas.map((act, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-gray-600 font-medium">
                      {act.fecha_hora ? new Date(act.fecha_hora).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-5">
                      {getAccionBadge(act.accion)}
                    </td>
                    <td className="px-6 py-5 text-gray-700 capitalize">
                      {act.entidad || '-'}
                    </td>
                    <td className="px-6 py-5 text-gray-700 leading-relaxed">
                      {act.detalles || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}