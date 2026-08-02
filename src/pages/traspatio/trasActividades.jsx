/* eslint-disable no-unused-vars */
// src/pages/comercial/MisActividades.jsx
import { useState, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function MisActividades() {
  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [actividades, setActividades] = useState([]);
  // const [stats, setStats] = useState({ todas: 0, creaciones: 0, actualizaciones: 0, desactivaciones: 0 });
  // 
  // useEffect(() => {
  //   const fetchActividades = async () => {
  //     try {
  //       // Envío de parámetros opcionales para paginación y filtros de fecha/búsqueda
  //       const res = await api.get('/comercial/actividades/log');
  //       setActividades(res.data.lista);
  //       setStats(res.data.estadisticas);
  //     } catch (error) {
  //       console.error("Error al cargar el historial de actividades:", error);
  //     }
  //   };
  //   fetchActividades();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  const mockStats = {
    todas: 10,
    creaciones: 5,
    actualizaciones: 3,
    desactivaciones: 2
  };

  const mockActividades = [
    {
      id: 1,
      fechaHora: '13 mar 2026 04:30 p.m.',
      accion: 'Crear',
      entidad: 'Certificación',
      detalles: 'Creó certificación de salud para animal Res-045'
    },
    {
      id: 2,
      fechaHora: '13 mar 2026 02:15 p.m.',
      accion: 'Actualizar',
      entidad: 'Perfil',
      detalles: 'Actualizó especialidad profesional a Medicina Veterinaria de Grandes Animales'
    },
    {
      id: 3,
      fechaHora: '13 mar 2026 11:45 a.m.',
      accion: 'Crear',
      entidad: 'Evaluación',
      detalles: 'Realizó evaluación clínica de animal Angus-123'
    },
    {
      id: 4,
      fechaHora: '12 mar 2026 03:20 p.m.',
      accion: 'Desactivar',
      entidad: 'Documento',
      detalles: 'Desactivó certificado vencido para animal Hol-067'
    },
    {
      id: 5,
      fechaHora: '12 mar 2026 10:00 a.m.',
      accion: 'Crear',
      entidad: 'Certificación',
      detalles: 'Emitió certificado de trazabilidad para lote de 8 bovinos'
    },
    {
      id: 6,
      fechaHora: '11 mar 2026 04:45 p.m.',
      accion: 'Actualizar',
      entidad: 'Evaluación',
      detalles: 'Actualizó resultados de evaluación para animal Brah-089'
    },
    {
      id: 7,
      fechaHora: '11 mar 2026 01:30 p.m.',
      accion: 'Crear',
      entidad: 'Documento',
      detalles: 'Generó reporte de certificaciones emitidas en marzo'
    },
    {
      id: 8,
      fechaHora: '10 mar 2026 03:15 p.m.',
      accion: 'Desactivar',
      entidad: 'Certificación',
      detalles: 'Anuló certificación duplicada para animal Sim-045'
    }
  ];

  // Función para renderizar el badge visual según el tipo de acción
  const getAccionBadge = (accion) => {
    switch (accion) {
      case 'Crear':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Crear</span>;
      case 'Actualizar':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">Actualizar</span>;
      case 'Desactivar':
        return <span className="bg-[#FFF4D2] text-[#8B6E00] px-3 py-1 rounded-full text-xs font-medium">Desactivar</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">{accion}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-serif pb-10">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Actividades</h1>
        <p className="text-gray-500 mt-2 font-sans">Revisa tu historial de acciones en el sistema</p>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans">
        
        {/* Tarjeta Activa (Todas) */}
        <div className="bg-[#427D32] text-white p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-[#366829] transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm font-medium">Todas</span>
          </div>
          <span className="text-3xl font-bold">{mockStats.todas}</span>
        </div>
        
        {/* Tarjeta Creaciones */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Creaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.creaciones}</span>
        </div>

        {/* Tarjeta Actualizaciones */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-600">Actualizaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.actualizaciones}</span>
        </div>

        {/* Tarjeta Desactivaciones */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
            <span className="text-sm font-medium text-gray-600">Desactivaciones</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.desactivaciones}</span>
        </div>
      </div>

      {/* Buscador y Rango de Fechas */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 font-sans shadow-sm">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID de animal o detalles..." 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm" 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="date" 
            className="flex-1 md:w-40 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm text-gray-600 bg-white"
          />
          <span className="text-gray-400 text-sm">hasta</span>
          <input 
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
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                    Fecha/Hora <ChevronDown className="h-3 w-3 text-gray-500" />
                  </div>
                </th>
                <th className="px-6 py-5">Acción</th>
                <th className="px-6 py-5">Entidad</th>
                <th className="px-6 py-5">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockActividades.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-gray-600 font-medium">
                    {act.fechaHora}
                  </td>
                  <td className="px-6 py-5">
                    {getAccionBadge(act.accion)}
                  </td>
                  <td className="px-6 py-5 text-gray-700">
                    {act.entidad}
                  </td>
                  <td className="px-6 py-5 text-gray-700 leading-relaxed">
                    {act.detalles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
