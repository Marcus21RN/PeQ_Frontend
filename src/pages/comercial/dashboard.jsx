/* eslint-disable no-unused-vars */

// src/pages/comercial/PanelPrincipalComercial.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, Edit2 } from 'lucide-react';

export default function PanelPrincipalComercial() {
  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [stats, setStats] = useState({ total: 0, revision: 0, porTipo: [] });
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const res = await api.get('/comercial/dashboard/stats');
  //       setStats(res.data);
  //     } catch (error) { console.error(error); }
  //   };
  //   fetchStats();
  // }, []);

  // DATOS SIMULADOS (MOCK DATA)
  const mockStats = {
    total: 24,
    revision: 4,
    porTipo: [
      { id: 'bovinos', nombre: 'Bovinos', desc: 'Ganado vacuno certificado', count: 12, img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=200&auto=format&fit=crop' },
      { id: 'porcinos', nombre: 'Porcinos', desc: 'Cerdos y porcinos registrados', count: 8, img: 'https://images.unsplash.com/photo-1604845564883-2945d7d3d259?q=80&w=200&auto=format&fit=crop' },
      { id: 'ovinos', nombre: 'Ovinos', desc: 'Ovejas y corderos', count: 4, img: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=200&auto=format&fit=crop' },
      { id: 'caprinos', nombre: 'Caprinos', desc: 'Cabras y cabritos', count: 0, img: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=200&auto=format&fit=crop' },
      { id: 'aves', nombre: 'Aves de Corral', desc: 'Pollos, gallinas y pavos', count: 0, img: 'https://images.unsplash.com/photo-1548550023-2bf3c49b6b7a?q=80&w=200&auto=format&fit=crop' }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-serif pb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#3B2211]">Panel Principal</h1>
        <p className="text-gray-500 mt-2 font-sans">Bienvenido al sistema de regulación de ganado</p>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">Total de Animales</p>
            <p className="text-4xl font-bold text-[#3B2211]">{mockStats.total}</p>
            <p className="text-xs text-gray-400 mt-2">Todos los tipos</p>
          </div>
          <div className="p-3 bg-[#F4F6F0] text-[#697D46] rounded-xl"><List className="w-6 h-6" /></div>
        </div>
        
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">En Revisión</p>
            <p className="text-4xl font-bold text-[#3B2211]">{mockStats.revision}</p>
            <p className="text-xs text-gray-400 mt-2">Pendientes de certificación</p>
          </div>
          <div className="p-3 bg-[#FFF4E5] text-[#D97706] rounded-xl"><Edit2 className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Inventario por Tipo */}
      <div>
        <h2 className="text-xl font-bold text-[#3B2211] mb-1">Inventario por Tipo de Animal</h2>
        <p className="text-sm text-gray-500 font-sans mb-6">Gestión de lotes y animales certificados</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {mockStats.porTipo.map((tipo) => (
            <Link 
              key={tipo.id} 
              to="/comercial/animales" 
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group block"
            >
              <div className="flex justify-between items-start mb-4">
                <img src={tipo.img} alt={tipo.nombre} className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${tipo.count > 0 ? 'bg-[#697D46] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tipo.count}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 font-serif group-hover:text-[#697D46] transition-colors">{tipo.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1">{tipo.desc}</p>
              <p className="text-xs text-gray-400 mt-4">Click para ver animales registrados</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
