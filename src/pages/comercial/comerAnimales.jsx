
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Eye, Edit2, Plus } from 'lucide-react';
import ModalDetalleAnimal from '../../components/comercialComponents/detalleAnimalModal.jsx';
import ModalRegistrarAnimal from '../../components/comercialComponents/registrarAnimalModal.jsx';
import ModalEditarAnimal from '../../components/comercialComponents/editarAnimalModal.jsx';
import { getAnimalesProductor } from '../../services/apiComercial/animalesProductor';

export default function MisAnimalesComercial() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Modales
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  
  const [animalSeleccionadoId, setAnimalSeleccionadoId] = useState(null);
  const [animalParaEditar, setAnimalParaEditar] = useState(null);

  // Estados API
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');

  // Carga de datos
  const recargarAnimales = async () => {
    try {
      const data = await getAnimalesProductor({ skip: 0, limit: 200 });
      setAnimales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al recargar animales comercial:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getAnimalesProductor({ skip: 0, limit: 200 })
      .then((data) => {
        if (isMounted) {
          setAnimales(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error('Error al cargar animales comercial:', err);
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

  // Debounce para el input de búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 300);
    return () => clearTimeout(t);
  }, [searchText]);

  // Conteo dinámico para las tarjetas superiores por especie
  const tipoCounts = useMemo(() => {
    const map = {};
    animales.forEach((a) => {
      const tipo = a.tipo_animal || a.tipo || 'Desconocido';
      map[tipo] = (map[tipo] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({ label: k, value: map[k] }));
  }, [animales]);

  // Normalizador estricto de texto para evitar inconsistencias con tildes y mayúsculas
  const normalizar = (texto) => {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  // Filtrado optimizado de la tabla
  const animalesFiltrados = useMemo(() => {
    if (!animales || animales.length === 0) return [];

    const tipoFiltroClean = normalizar(searchParams.get('tipo'));
    const estadoFiltroClean = normalizar(estadoFiltro);
    const searchClean = normalizar(debouncedSearch);

    return animales.filter((a) => {
      const id = normalizar(a.id_animal || a.id || a.arete_id);
      const tipo = normalizar(a.tipo_animal || a.tipo);
      const raza = normalizar(a.raza || a.raza_animal);
      const estadoCert = normalizar(a.estado_certificacion || a.estado || a.condicion);

      // 1. Filtro por categoría (Tarjetas superiores)
      if (tipoFiltroClean && !tipo.includes(tipoFiltroClean)) {
        return false;
      }

      // 2. Filtro por Estado (Menú desplegable)
      if (estadoFiltroClean) {
        const coincide =
          estadoCert.includes(estadoFiltroClean) ||
          (estadoFiltroClean === 'certificado' && (estadoCert.includes('aprob') || estadoCert.includes('cert'))) ||
          (estadoFiltroClean === 'aprobado' && (estadoCert.includes('aprob') || estadoCert.includes('cert'))) ||
          (estadoFiltroClean === 'en revision' && estadoCert.includes('rev')) ||
          (estadoFiltroClean === 'pendiente' && estadoCert.includes('pend')) ||
          (estadoFiltroClean === 'rechazado' && estadoCert.includes('rechaz'));

        if (!coincide) return false;
      }

      // 3. Filtro por Búsqueda (Input de texto)
      if (searchClean && !(id.includes(searchClean) || raza.includes(searchClean))) {
        return false;
      }

      return true;
    });
  }, [animales, searchParams, estadoFiltro, debouncedSearch]);

  const handleSelectTipo = (label) => {
    const actual = (searchParams.get('tipo') || '').toLowerCase();
    setSearchParams((prev) => {
      if (actual === label.toLowerCase()) {
        prev.delete('tipo');
      } else {
        prev.set('tipo', label);
      }
      return prev;
    });
  };

  const abrirDetalle = (areteOrId) => {
    setAnimalSeleccionadoId(areteOrId);
    setIsDetalleModalOpen(true);
  };

  const abrirEditar = (animalRow) => {
    const idDisplay = animalRow.id || animalRow.id_animal;
    const raza = animalRow.raza || animalRow.raza_animal || '';
    const tipo = animalRow.tipo || animalRow.tipo_animal || '';
    const edad = animalRow.edad || (animalRow.edad_anios != null ? `${animalRow.edad_anios} años` : '');
    const peso = animalRow.peso || (animalRow.peso_kg != null ? `${animalRow.peso_kg} kg` : '');

    setAnimalParaEditar({
      id_display: idDisplay,
      nombre: `${raza} 001`,
      sexo: 'Hembra',
      edad: String(edad).replace(' años', ''),
      peso: String(peso).replace(' kg', ''),
      condicion: 'Bueno',
      proposito: 'Producción',
      tipo_produccion: 'Engorda',
      lote: 'Lote Principal',
      origen: 'Granja San José',
      tipo,
      raza,
    });
    setIsEditarModalOpen(true);
  };

  const limpiarFiltros = () => {
    setSearchText('');
    setDebouncedSearch('');
    setEstadoFiltro('');
    setSearchParams({});
  };

  const getEstadoBadge = (estado) => {
    if (!estado) return null;
    const e = normalizar(estado);
    if (e.includes('cert') || e.includes('registr') || e.includes('aprob')) 
      return <span className="bg-[#EAF3E6] text-[#5C743D] px-3 py-1 rounded-full text-xs font-bold">Certificado</span>;
    if (e.includes('rev') || e.includes('revis')) 
      return <span className="bg-[#FFF4E5] text-[#D97706] px-3 py-1 rounded-full text-xs font-bold">En Revisión</span>;
    if (e.includes('pend')) 
      return <span className="bg-[#F0F2E8] text-[#7A8A61] px-3 py-1 rounded-full text-xs font-bold">Pendiente</span>;
    if (e.includes('rechaz')) 
      return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Rechazado</span>;
    return <span className="bg-[#F5F5F5] text-gray-700 px-3 py-1 rounded-full text-xs">{estado}</span>;
  };

  const tipoActual = (searchParams.get('tipo') || '').toLowerCase();

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-serif pb-10">
      
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-[#3B2211]">Mis Animales</h1>
        <p className="text-gray-500 mt-2 font-sans text-sm">Gestiona y consulta el estado de tus animales registrados</p>
      </div>

      {/* Cajas Superiores por Especie */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 font-sans">
        {tipoCounts.length === 0 ? (
          <div className="col-span-6 text-gray-500 text-sm">No hay tipos registrados</div>
        ) : (
          tipoCounts.map((f, i) => (
            <button
              key={i}
              onClick={() => handleSelectTipo(f.label)}
              className={`rounded-xl p-4 text-center shadow-sm border ${
                tipoActual === f.label.toLowerCase() ? 'border-[#3B2211] bg-[#F3F6F1]' : 'border-gray-200 bg-white'
              } hover:bg-gray-50 transition-colors`}
            >
              <p className="text-xs text-gray-500 mb-1">{f.label}</p>
              <p className="text-xl font-bold text-[#3B2211]">{f.value}</p>
            </button>
          ))
        )}
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 font-sans shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Buscar por ID, Arete o raza..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm"
          />
        </div>
        
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C743D] text-sm md:w-48 bg-white cursor-pointer"
        >
          <option value="">Todos los estados</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Certificado">Certificado</option>
          <option value="En Revisión">En Revisión</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Rechazado">Rechazado</option>
        </select>
        
        <button 
          onClick={limpiarFiltros} 
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Limpiar
        </button>
        
        <button 
          onClick={() => setIsRegistrarModalOpen(true)}
          className="bg-[#3B2211] hover:bg-[#2A180C] text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Registrar Animal
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-[#FDFDFB] border border-gray-200 rounded-2xl shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-800">
            <thead className="bg-[#F7F8F3] border-b border-[#E8ECE1] text-xs font-bold text-[#3B2211]">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Tipo</th>
                <th className="px-6 py-5">Raza</th>
                <th className="px-6 py-5">Edad</th>
                <th className="px-6 py-5">Peso (kg)</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-6 py-5">Precio Est.</th>
                <th className="px-6 py-5">Fecha</th>
                <th className="px-6 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECE1]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">Cargando animales...</td>
                </tr>
              ) : animalesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">No se encontraron animales para el filtro seleccionado.</td>
                </tr>
              ) : (
                animalesFiltrados.map((a, idx) => (
                  <tr key={a.id_animal || a.id || idx} className="hover:bg-white transition-colors">
                    <td className="px-6 py-4 font-bold text-[#3B2211] font-serif">{a.id_animal || a.arete_id || a.id}</td>
                    <td className="px-6 py-4">{a.tipo_animal || a.tipo}</td>
                    <td className="px-6 py-4">{a.raza || a.raza_animal}</td>
                    <td className="px-6 py-4">{a.edad_anios != null ? `${a.edad_anios} años` : (a.edad ? `${a.edad} años` : 'N/A')}</td>
                    <td className="px-6 py-4">{a.peso_kg != null ? `${a.peso_kg} kg` : (a.peso ? `${a.peso} kg` : 'N/A')}</td>
                    <td className="px-6 py-4">{getEstadoBadge(a.estado_certificacion || a.estado || a.condicion)}</td>
                    <td className="px-6 py-4 font-semibold">
                      {a.precio_estimado != null || a.precio_venta != null 
                        ? `$${Number(a.precio_estimado ?? a.precio_venta).toLocaleString('es-MX')}` 
                        : (a.precio || 'N/A')}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {a.fecha_registro ? new Date(a.fecha_registro).toLocaleDateString('es-MX') : (a.fecha || '-')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button 
                          onClick={() => abrirDetalle(a.id_animal || a.arete_id || a.id)} 
                          className="text-[#5C743D] hover:text-[#3B2211] transition-colors" 
                          title="Ver Detalles"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => abrirEditar(a)} 
                          className="text-[#D97706] hover:text-[#3B2211] transition-colors" 
                          title="Editar Animal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tarjetas Inferiores KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1 font-serif">Total Registrados</p>
          <p className="text-3xl font-bold text-[#3B2211] font-serif">{animales.length}</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1 font-serif">Certificados</p>
          <p className="text-3xl font-bold text-[#5C743D] font-serif">
            {animales.filter(a => {
              const e = normalizar(a.estado_certificacion || a.estado || a.condicion);
              return e.includes('cert') || e.includes('registr') || e.includes('aprob');
            }).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1 font-serif">En Revisión</p>
          <p className="text-3xl font-bold text-[#D97706] font-serif">
            {animales.filter(a => {
              const e = normalizar(a.estado_certificacion || a.estado || a.condicion);
              return e.includes('rev');
            }).length}
          </p>
        </div>
      </div>

      {/* Modales */}
      <ModalDetalleAnimal 
        isOpen={isDetalleModalOpen}
        onClose={() => setIsDetalleModalOpen(false)}
        animalId={animalSeleccionadoId}
      />
      
      <ModalRegistrarAnimal 
        isOpen={isRegistrarModalOpen}
        onClose={() => setIsRegistrarModalOpen(false)}
        onRegistrado={recargarAnimales}
      />
      
      <ModalEditarAnimal 
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        animalId={animalParaEditar?.id_display}
        dataActual={animalParaEditar}
        onActualizado={recargarAnimales}
      />

    </div>
  );
}