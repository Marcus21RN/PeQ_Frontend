import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronDown } from 'lucide-react';
import { getBitacoraSistema, getRolesCatalogo } from '../../services/apiAdmin/panelAdmin.js';

export default function LogActividades() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [rolesCatalogo, setRolesCatalogo] = useState([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const cargarLogs = async () => {
    try {
      const params = {};
      if (tipoUsuario) params.id_rol = tipoUsuario;
      if (fechaDesde) params.fecha_cambio_desde = fechaDesde;
      if (fechaHasta) params.fecha_cambio_hasta = fechaHasta;

      const data = await getBitacoraSistema(params);
      setLogs(data);
      setError(null);
    } catch (requestError) {
      console.error('Error al cargar el log de actividades admin:', requestError);
      setError('No se pudo cargar la bitácora del sistema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs();
  }, [tipoUsuario, fechaDesde, fechaHasta]);

  useEffect(() => {
    let isMounted = true;

    const cargarRoles = async () => {
      try {
        const roles = await getRolesCatalogo();
        if (!isMounted) return;
        setRolesCatalogo(roles);
      } catch (requestError) {
        console.error('Error al cargar roles para bitácora:', requestError);
        if (isMounted) {
          setRolesCatalogo([]);
        }
      }
    };

    cargarRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  // Función para renderizar el badge de la acción con los colores exactos de tu diseño
  const getAccionBadge = (accion) => {
    switch (accion) {
      case 'Crear': 
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Crear</span>;
      case 'Actualizar': 
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Actualizar</span>;
      case 'Desactivar': 
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Desactivar</span>;
      case 'Eliminar': 
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Eliminar</span>;
      default: 
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{accion}</span>;
    }
  };

  const logsFiltrados = logs.filter((log) => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return true;

    return [
      log.fecha_hora,
      log.usuario_responsable,
      log.tipo_usuario,
      log.accion,
      log.entidad,
      log.detalles,
      log.ciudad,
    ].some((value) => (value || '').toLowerCase().includes(search));
  });

  const stats = {
    todas: logs.length,
    creaciones: logs.filter((log) => log.accion === 'Crear').length,
    actualizaciones: logs.filter((log) => log.accion === 'Actualizar').length,
    desactivaciones: logs.filter((log) => ['Desactivar', 'Eliminar'].includes(log.accion)).length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando bitácora...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-16 text-center font-sans text-red-600">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-serif">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Log de Actividades</h1>
        <p className="text-gray-500 mt-2 font-sans">Revisa todas las acciones realizadas por usuarios del sistema</p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
        <div className="bg-[#5A3B2A] text-white p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm font-medium">Todas</span>
          </div>
          <span className="text-3xl font-bold">{stats.todas}</span>
        </div>
        
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Creaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.creaciones}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-600">Actualizaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.actualizaciones}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-sm font-medium text-gray-600">Desactivaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.desactivaciones}</span>
        </div>
      </div>

      {/* Sección de Filtros (Caja combinada según el diseño) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm font-sans space-y-4">
        {/* Búsqueda */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none text-sm"
            placeholder="Buscar por nombre o ID de usuario..."
          />
        </div>

        {/* Filtros avanzados */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="relative">
              <select value={tipoUsuario} onChange={(event) => setTipoUsuario(event.target.value)} className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A3B2A] text-sm cursor-pointer">
                <option value="">Tipo de Usuario...</option>
                {rolesCatalogo.map((rol) => (
                  <option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input 
              type="date" 
              value={fechaDesde}
              onChange={(event) => setFechaDesde(event.target.value)}
              className="border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A3B2A] text-sm"
            />
            <span className="text-gray-500 text-sm">hasta</span>
            <input 
              type="date" 
              value={fechaHasta}
              onChange={(event) => setFechaHasta(event.target.value)}
              className="border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A3B2A] text-sm"
            />
            <button type="button" onClick={cargarLogs} className="px-4 py-2.5 rounded-xl bg-[#5A3B2A] text-white text-sm font-medium hover:bg-[#4A2F22]">
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-700">
              <tr>
                <th className="px-6 py-5 flex items-center gap-1 cursor-pointer hover:text-gray-900">
                  Fecha/Hora <ChevronDown className="h-3 w-3" />
                </th>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    Usuario <ChevronDown className="h-3 w-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-5">Tipo Usuario</th>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    Acción <ChevronDown className="h-3 w-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-5">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    Entidad <ChevronDown className="h-3 w-3 text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-5">Detalles</th>
                <th className="px-6 py-5">Ciudad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logsFiltrados.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 whitespace-pre-line leading-relaxed">
                    {log.fecha_hora}
                  </td>
                  <td className="px-6 py-6 font-medium text-gray-900">
                    <div className="w-28 wrap-break-word">{log.usuario_responsable}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="w-20 wrap-break-word">{log.tipo_usuario}</div>
                  </td>
                  <td className="px-6 py-6">
                    {getAccionBadge(log.accion)}
                  </td>
                  <td className="px-6 py-6">{log.entidad}</td>
                  <td className="px-6 py-6 text-gray-700">
                    <div className="w-48 wrap-break-word leading-relaxed">{log.detalles}</div>
                  </td>
                  <td className="px-6 py-6">{log.ciudad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer con Paginación */}
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>
            Mostrando <span className="font-bold text-gray-900">1 a {logsFiltrados.length}</span> de <span className="font-bold text-gray-900">{logs.length}</span> actividades
          </div>
          
          {/* Paginador visual simulado basado en el diseño */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-gray-400 cursor-not-allowed">← Anterior</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#5A3B2A] text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">3</button>
            <button className="px-3 py-1 text-gray-700 hover:text-gray-900 font-medium">Siguiente →</button>
          </div>
        </div>
      </div>

    </div>
  );
}
