/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronDown } from 'lucide-react';

export default function LogActividades() {
  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [logs, setLogs] = useState([]);
  // const [stats, setStats] = useState({ todas: 0, creaciones: 0, actualizaciones: 0, desactivaciones: 0 });
  // 
  // useEffect(() => {
  //   const fetchLogs = async () => {
  //     try {
  //       // Aquí podrías enviar parámetros de paginación y filtros
  //       const res = await api.get('/admin/logs'); 
  //       setLogs(res.data.lista);
  //       setStats(res.data.estadisticas);
  //     } catch (error) {
  //       console.error("Error al cargar el log de actividades:", error);
  //     }
  //   };
  //   fetchLogs();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  const mockStats = {
    todas: 30,
    creaciones: 14,
    actualizaciones: 11,
    desactivaciones: 5
  };

  // Reducido a 4 registros como solicitaste
  const mockLogs = [
    {
      id: 1,
      fechaHora: '13 mar 2026\n02:30 p.m.',
      usuario: 'Carlos Mendoza García',
      tipoUsuario: 'Rancho Comercial',
      accion: 'Crear',
      entidad: 'Animal',
      detalles: 'Registró nuevo bovino "Res-001" para engorda',
      ciudad: 'Guadalajara'
    },
    {
      id: 2,
      fechaHora: '13 mar 2026\n10:15 a.m.',
      usuario: 'Luis García López',
      tipoUsuario: 'Rancho Traspatio',
      accion: 'Actualizar',
      entidad: 'Información de Rancho',
      detalles: 'Actualizó capacidad del rancho: 50 → 60 animales',
      ciudad: 'Zapopan'
    },
    {
      id: 3,
      fechaHora: '12 mar 2026\n04:45 p.m.',
      usuario: 'Dr. Ana López Martínez',
      tipoUsuario: 'Veterinario',
      accion: 'Crear',
      entidad: 'Solicitud de Certificación',
      detalles: 'Creó solicitud de certificación para animal ID: 12345',
      ciudad: 'Ciudad de México'
    },
    {
      id: 4,
      fechaHora: '12 mar 2026\n01:20 p.m.',
      usuario: 'María Rodríguez Castillo',
      tipoUsuario: 'Rancho Comercial',
      accion: 'Desactivar',
      entidad: 'Animal',
      detalles: 'Desactivó registro de bovino vendido "Res-045"',
      ciudad: 'Monterrey'
    }
  ];

  // Función para renderizar el badge de la acción con los colores exactos de tu diseño
  const getAccionBadge = (accion) => {
    switch (accion) {
      case 'Crear': 
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Crear</span>;
      case 'Actualizar': 
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Actualizar</span>;
      case 'Desactivar': 
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">Desactivar</span>;
      default: 
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{accion}</span>;
    }
  };

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
          <span className="text-3xl font-bold">{mockStats.todas}</span>
        </div>
        
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Creaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.creaciones}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-600">Actualizaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.actualizaciones}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-sm font-medium text-gray-600">Desactivaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.desactivaciones}</span>
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
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none text-sm"
            placeholder="Buscar por nombre o ID de usuario..."
          />
        </div>

        {/* Filtros avanzados */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A3B2A] text-sm cursor-pointer">
                <option value="">Tipo de Usuario...</option>
                <option value="admin">Administrador</option>
                <option value="comercial">Rancho Comercial</option>
                <option value="traspatio">Rancho Traspatio</option>
                <option value="vet">Veterinario</option>
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
              className="border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A3B2A] text-sm"
            />
            <span className="text-gray-500 text-sm">hasta</span>
            <input 
              type="date" 
              className="border border-gray-200 text-gray-600 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5A3B2A] text-sm"
            />
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
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-6 whitespace-pre-line leading-relaxed">
                    {log.fechaHora}
                  </td>
                  <td className="px-6 py-6 font-medium text-gray-900">
                    <div className="w-28 wrap-break-word">{log.usuario}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="w-20 wrap-break-word">{log.tipoUsuario}</div>
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
            Mostrando <span className="font-bold text-gray-900">1 a 4</span> de <span className="font-bold text-gray-900">30</span> actividades
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
