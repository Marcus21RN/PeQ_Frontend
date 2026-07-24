/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import ModalDetalleSolicitud from '../../components/adminComponents/detalleSolicitudModal.jsx';

export default function TodasLasSolicitudes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [solicitudes, setSolicitudes] = useState([]);
  // const [stats, setStats] = useState({ todas: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 });
  // 
  // useEffect(() => {
  //   const fetchSolicitudes = async () => {
  //     try {
  //       const res = await api.get('/admin/solicitudes');
  //       setSolicitudes(res.data.lista);
  //       setStats(res.data.estadisticas);
  //     } catch (error) {
  //       console.error("Error al cargar solicitudes:", error);
  //     }
  //   };
  //   fetchSolicitudes();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // ==========================================
  const mockStats = {
    todas: 7,
    pendientes: 4,
    aprobadas: 2,
    rechazadas: 1
  };

  const mockSolicitudes = [
    { id: 'SOL-R002', tipo: 'Rancho Traspatio', nombre: 'Luis García López', email: 'luis.garcia@email.com', tel: '5556789012', fecha: '21 feb 2026', estado: 'Pendiente' },
    { id: 'SOL-V001', tipo: 'Veterinario', nombre: 'Dr. Ana López Martínez', email: 'ana.lopez@email.com', tel: '5559876543', fecha: '20 feb 2026', estado: 'Pendiente' },
    { id: 'SOL-R001', tipo: 'Rancho Comercial', nombre: 'Carlos Mendoza García', email: 'carlos.mendoza@email.com', tel: '5551234567', fecha: '19 feb 2026', estado: 'Pendiente' },
    { id: 'SOL-R005', tipo: 'Rancho Comercial', nombre: 'Fernando Torres Jiménez', email: 'fernando.torres@email.com', tel: '5557654321', fecha: '17 feb 2026', estado: 'Pendiente' },
    { id: 'SOL-R003', tipo: 'Rancho Comercial', nombre: 'María Rodríguez Castillo', email: 'maria.rodriguez@email.com', tel: '5552876543', fecha: '9 feb 2026', estado: 'Aprobada' },
    { id: 'SOL-V002', tipo: 'Veterinario', nombre: 'Dr. Roberto Sánchez Flores', email: 'roberto.sanchez@email.com', tel: '5555432109', fecha: '4 feb 2026', estado: 'Rechazada' },
    { id: 'SOL-R004', tipo: 'Rancho Traspatio', nombre: 'Patricia Gómez Herrera', email: 'patricia.gomez@email.com', tel: '5553456789', fecha: '24 ene 2026', estado: 'Aprobada' },
  ];

  const abrirModal = (id) => {
    setSolicitudSeleccionada(id);
    setIsModalOpen(true);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Pendiente': return <span className="bg-[#FFF4D2] text-[#8B6E00] px-3 py-1 rounded-full text-xs font-medium">Pendiente</span>;
      case 'Aprobada': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">Aprobada</span>;
      case 'Rechazada': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">Rechazada</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-serif">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Todas las Solicitudes</h1>
        <p className="text-gray-500 mt-2 font-sans">Gestiona y revisa las solicitudes de registro pendientes</p>
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
        
        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#EAB308]"></div>
            <span className="text-sm font-medium text-gray-600">Pendientes</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.pendientes}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Aprobadas</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.aprobadas}</span>
        </div>

        <div className="bg-white border border-gray-200 p-5 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Rechazadas</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">{mockStats.rechazadas}</span>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex gap-4 font-sans">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] focus:border-[#5A3B2A] outline-none"
            placeholder="Buscar por ID, nombre, email..."
          />
        </div>
        <button className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-gray-600 hover:bg-gray-50 flex items-center justify-center">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Solicitud</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSolicitudes.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{sol.id}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 wrap-break-word">{sol.tipo}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="w-32 wrap-break-word">{sol.nombre}</div>
                  </td>
                  <td className="px-6 py-4">{sol.email}</td>
                  <td className="px-6 py-4">{sol.tel}</td>
                  <td className="px-6 py-4">
                    <div className="w-16 wrap-break-word">{sol.fecha}</div>
                  </td>
                  <td className="px-6 py-4">{getEstadoBadge(sol.estado)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => abrirModal(sol.id)}
                        className="bg-[#5A3B2A] hover:bg-[#4A2F22] text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Revisar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
          Mostrando <span className="font-bold text-gray-900 mx-1">7</span> de <span className="font-bold text-gray-900 mx-1">7</span> solicitudes
        </div>
      </div>

      <ModalDetalleSolicitud 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        solicitudId={solicitudSeleccionada}
      />
      
    </div>
  );
}
