
// src/pages/comercial/PanelPrincipalComercial.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ShieldCheck } from 'lucide-react';
import { getDashboardProductor } from '../../services/apiTraspatio/dashboarProductor.js';

export default function PanelPrincipalComercial() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Imágenes por defecto según el tipo de categoría
  const categoryImages = {
    bovino: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=200&auto=format&fit=crop',
    porcino: 'https://images.unsplash.com/photo-1604845564883-2945d7d3d259?q=80&w=200&auto=format&fit=crop',
    ovino: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=200&auto=format&fit=crop',
    caprino: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=200&auto=format&fit=crop',
    aves: 'https://images.unsplash.com/photo-1548550023-2bf3c49b6b7a?q=80&w=200&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=200&auto=format&fit=crop'
  };

  const getCategoryImage = (nombre) => {
    const key = (nombre || '').toLowerCase();
    for (const [cat, url] of Object.entries(categoryImages)) {
      if (key.includes(cat)) return url;
    }
    return categoryImages.default;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardProductor();
        setDashboardData(data);
      } catch (err) {
        console.error('Error cargando datos del panel:', err);
        setError('No se pudieron cargar las estadísticas del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center font-sans text-gray-500">
        <p className="text-lg">Cargando panel principal...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center font-sans text-red-600">
        <p className="text-lg">{error || 'Error al obtener la información.'}</p>
      </div>
    );
  }

  const { resumen_general, desglose_categorias } = dashboardData;

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-serif pb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#3B2211]">Panel Principal</h1>
        <p className="text-gray-500 mt-2 font-sans">Bienvenido al sistema de regulación de ganado</p>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        
        {/* Total de Animales Registrados */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">Total de Animales Registrados</p>
            <p className="text-4xl font-bold text-[#3B2211]">{resumen_general?.total_animales_registrados ?? 0}</p>
            <p className="text-xs text-gray-400 mt-2">Animales dados de alta en tu rancho</p>
          </div>
          <div className="p-3 bg-[#F4F6F0] text-[#697D46] rounded-xl">
            <List className="w-6 h-6" />
          </div>
        </div>
        
        {/* Límite Permitido / Capacidad */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-2">Límite Permitido (Capacidad)</p>
            <p className="text-4xl font-bold text-[#3B2211]">{resumen_general?.limite_permitido ?? 0}</p>
            <p className="text-xs text-gray-400 mt-2">Capacidad máxima autorizada</p>
          </div>
          <div className="p-3 bg-[#EAF3E6] text-[#387030] rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Inventario por Tipo */}
      <div>
        <h2 className="text-xl font-bold text-[#3B2211] mb-1">Inventario por Categoria</h2>
        <p className="text-sm text-gray-500 font-sans mb-6">Desglose de animales registrados en la plataforma</p>
        
        {desglose_categorias && desglose_categorias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            {desglose_categorias.map((cat, index) => (
              <Link 
                key={index} 
                to={`/traspatio/animales?tipo=${encodeURIComponent(cat.categoria)}`} 
                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group block"
              >
                <div className="flex justify-between items-start mb-4">
                  <img 
                    src={getCategoryImage(cat.categoria)} 
                    alt={cat.categoria} 
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200" 
                  />
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${cat.total_registrados > 0 ? 'bg-[#697D46] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.total_registrados}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 font-serif group-hover:text-[#697D46] transition-colors">
                  {cat.categoria}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Registrados en la plataforma</p>
                <p className="text-xs text-gray-400 mt-4">Haz clic para consultar listado</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center font-sans text-gray-500">
            No hay categorías de animales registradas hasta el momento.
          </div>
        )}
      </div>
    </div>
  );
}