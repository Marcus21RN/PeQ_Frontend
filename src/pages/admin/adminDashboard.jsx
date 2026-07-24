/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

import ModalRevisionSolicitud from '../../components/adminComponents/revisionSolicitudModal.jsx';

export default function AdminDashboard() {
  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // Aquí declararemos los estados reales cuando conectemos con Axios.
  // const [stats, setStats] = useState({ comerciales: 0, traspatio: 0, veterinarios: 0 });
  // const [solicitudes, setSolicitudes] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const resStats = await api.get('/admin/stats');
  //       const resSolicitudes = await api.get('/admin/solicitudes-pendientes');
  //       setStats(resStats.data);
  //       setSolicitudes(resSolicitudes.data);
  //     } catch (error) {
  //       console.error("Error cargando datos:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // ==========================================
  // DATOS SIMULADOS (MOCK DATA)
  // Mientras se define la base de datos
  // ==========================================

    // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

    // Función para abrir el modal
  const abrirModalRevisar = (idSolicitud) => {
    setSolicitudSeleccionada(idSolicitud);
    setIsModalOpen(true);
  };

  const mockStats = {
    comerciales: 45,
    traspatio: 128,
    veterinarios: 12
  };

  const mockSolicitudes = [
    {
      id: 1,
      nombre: 'Carlos Mendoza',
      rol: 'Rancho Comercial',
      email: 'carlos.mendoza@email.com',
      telefono: '5551234567',
      ubicacion: 'Guadalajara, Jalisco',
      fecha: '19 de febrero de 2026'
    },
    {
      id: 2,
      nombre: 'Ana López',
      rol: 'Veterinario Certificador',
      email: 'ana.lopez@email.com',
      telefono: '5559876543',
      ubicacion: 'Ciudad de México, CDMX',
      fecha: '20 de febrero de 2026'
    },
    {
      id: 3,
      nombre: 'Luis García',
      rol: 'Productor Traspatio',
      email: 'luis.garcia@email.com',
      telefono: '5556789012',
      ubicacion: 'Zapopan, Jalisco',
      fecha: '21 de febrero de 2026'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-serif">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-2 font-sans">Gestiona usuarios y genera reportes del sistema</p>
      </div>

      {/* Tarjetas de Estadísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Tarjeta 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500">Ranchos Comerciales</span>
          <span className="text-4xl font-bold text-gray-900 mt-4 mb-2">{mockStats.comerciales}</span>
          <span className="text-xs text-gray-400">Usuarios activos</span>
        </div>

        {/* Tarjeta 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500">Productores Traspatio</span>
          <span className="text-4xl font-bold text-gray-900 mt-4 mb-2">{mockStats.traspatio}</span>
          <span className="text-xs text-gray-400">Usuarios activos</span>
        </div>

        {/* Tarjeta 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-500">Veterinarios Certificadores</span>
          <span className="text-4xl font-bold text-gray-900 mt-4 mb-2">{mockStats.veterinarios}</span>
          <span className="text-xs text-gray-400">Usuarios activos</span>
        </div>

      </div>

      {/* Sección de Solicitudes Pendientes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm font-sans overflow-hidden">
        
        {/* Cabecera de la sección */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Solicitudes de Registro Pendientes</h2>
            <p className="text-sm text-gray-500 mt-1">Revisa y aprueba los nuevos registros</p>
          </div>
          <span className="bg-[#FFF4D2] text-[#8B6E00] px-3 py-1 rounded-full text-sm font-medium">
            {mockSolicitudes.length} pendientes
          </span>
        </div>

        {/* Lista de Solicitudes */}
        <div className="flex flex-col">
          {mockSolicitudes.map((solicitud, index) => (
            <div 
              key={solicitud.id} 
              className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-gray-50 transition-colors ${
                index !== mockSolicitudes.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              {/* Información del usuario */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 font-serif">{solicitud.nombre}</h3>
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-100">
                    {solicitud.rol}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span> {solicitud.email}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Teléfono:</span> {solicitud.telefono}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ubicación:</span> {solicitud.ubicacion}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 mt-3">
                  Solicitado el {solicitud.fecha}
                </div>
              </div>

              {/* Botón de Acción */}
              <div>
                <button onClick={() => abrirModalRevisar(solicitud.id)} className="bg-[#5A3B2A] hover:bg-[#4A2F22] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                  <Eye className="w-4 h-4" />
                  Revisar
                </button>
                <ModalRevisionSolicitud 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    solicitudId={solicitudSeleccionada}
                />
              </div>
            </div>
          ))}
        </div>
        
      </div>

    </div>
  );
}
