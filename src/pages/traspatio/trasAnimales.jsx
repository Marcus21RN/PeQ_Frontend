/* eslint-disable no-unused-vars */

// src/pages/comercial/MisAnimales.jsx
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, FileText, Edit2, Plus } from 'lucide-react';
import ModalDetalleAnimal from '../../components/comercialComponents/detalleAnimalModal.jsx';
import ModalRegistrarAnimal from '../../components/comercialComponents/registrarAnimalModal.jsx';
import ModalEditarAnimal from '../../components/comercialComponents/editarAnimalModal.jsx';

export default function MisAnimales() {
  // Estados para los modales
  const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  
  // Estados para los datos seleccionados
  const [animalSeleccionadoId, setAnimalSeleccionadoId] = useState(null);
  const [animalParaEditar, setAnimalParaEditar] = useState(null);

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const [animales, setAnimales] = useState([]);
  // useEffect(() => {
  //   const fetchAnimales = async () => {
  //     const res = await api.get('/comercial/animales');
  //     setAnimales(res.data);
  //   };
  //   fetchAnimales();
  // }, []);

  // DATOS SIMULADOS (MOCK DATA)
  const mockFiltros = [
    { label: 'Bovinos', value: 3, color: 'text-green-600' },
    { label: 'Porcinos', value: 1, color: 'text-orange-500' },
    { label: 'Ovinos', value: 1, color: 'text-green-600' },
    { label: 'Caprinos', value: 1, color: 'text-[#3B2211]' },
    { label: 'Equinos', value: 1, color: 'text-blue-500' },
    { label: 'Avícolas', value: 1, color: 'text-yellow-500' },
  ];

  const mockAnimales = [
    { id: 'BOV-001', tipo: 'Bovino', raza: 'Holstein', edad: '3 años', peso: '520 kg', estado: 'Certificado', precio: '$28,600', fecha: '14/1/2025' },
    { id: 'BOV-002', tipo: 'Bovino', raza: 'Angus', edad: '2.5 años', peso: '450 kg', estado: 'En Revisión', precio: '$24,750', fecha: '9/2/2025' },
    { id: 'BOV-003', tipo: 'Bovino', raza: 'Jersey', edad: '4 años', peso: '380 kg', estado: 'Certificado', precio: '$20,900', fecha: '19/1/2025' },
    { id: 'POR-001', tipo: 'Porcino', raza: 'Duroc', edad: '1.5 años', peso: '180 kg', estado: 'Pendiente', precio: 'N/A', fecha: '17/2/2025', doc: true },
    { id: 'OVI-001', tipo: 'Ovino', raza: 'Merino', edad: '2 años', peso: '65 kg', estado: 'Certificado', precio: '$3,575', fecha: '4/2/2025' },
    { id: 'CAP-001', tipo: 'Caprino', raza: 'Saanen', edad: '1.5 años', peso: '55 kg', estado: 'En Revisión', precio: 'N/A', fecha: '28/2/2025' },
    { id: 'EQU-001', tipo: 'Equino', raza: 'Cuarto de Milla', edad: '5 años', peso: '450 kg', estado: 'Certificado', precio: '$45,000', fecha: '9/1/2025' },
    { id: 'AVE-001', tipo: 'Avícola', raza: 'Rhode Island', edad: '0.5 años', peso: '2.5 kg', estado: 'Certificado', precio: '$125', fecha: '19/2/2025' }
  ];

  // Controladores de apertura de modales
  const abrirDetalle = (id) => {
    setAnimalSeleccionadoId(id);
    setIsDetalleModalOpen(true);
  };

  const abrirEditar = (animalRow) => {
    // Mapeamos los datos básicos de la fila para inyectarlos en el modal de edición
    setAnimalParaEditar({
      id_display: animalRow.id,
      nombre: `${animalRow.raza} 001`, // Nombre simulado
      sexo: 'Hembra', // Dato simulado por defecto
      edad: animalRow.edad.replace(' años', ''),
      peso: animalRow.peso.replace(' kg', ''),
      condicion: 'Bueno',
      proposito: 'Producción',
      tipo_produccion: 'Engorda',
      lote: 'Lote Principal',
      origen: 'Granja San José, Michoacán',
      tipo: animalRow.tipo,
      raza: animalRow.raza
    });
    setIsEditarModalOpen(true);
  };

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'Certificado': return <span className="bg-[#EAF3E6] text-[#5C743D] px-3 py-1 rounded-full text-xs font-bold">Certificado</span>;
      case 'En Revisión': return <span className="bg-[#FFF4E5] text-[#D97706] px-3 py-1 rounded-full text-xs font-bold">En Revisión</span>;
      case 'Pendiente': return <span className="bg-[#F0F2E8] text-[#7A8A61] px-3 py-1 rounded-full text-xs font-bold">Pendiente</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-serif pb-10">
      
      <div>
        <h1 className="text-3xl font-bold text-[#3B2211]">Mis Animales</h1>
        <p className="text-gray-500 mt-2 font-sans">Gestiona y consulta el estado de tus animales registrados</p>
      </div>

      {/* Cajas Superiores (Filtros Rápidos) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 font-sans">
        {mockFiltros.map((f, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm cursor-pointer hover:bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">{f.label}</p>
            <p className={`text-xl font-bold ${f.color}`}>{f.value}</p>
          </div>
        ))}
      </div>

      {/* Buscador y Controles */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 font-sans shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Buscar por ID o raza..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5C743D] outline-none text-sm" />
        </div>
        <select className="border border-gray-200 text-gray-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C743D] text-sm md:w-48 bg-white cursor-pointer">
          <option>Todos los estados</option>
          <option>Certificados</option>
          <option>En Revisión</option>
        </select>
        
        <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
          <Filter className="w-4 h-4" /> Limpiar
        </button>
        
        {/* Botón principal para Registrar Nuevo Animal */}
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
              {mockAnimales.map((a) => (
                <tr key={a.id} className="hover:bg-white transition-colors">
                  <td className="px-6 py-4 font-bold text-[#3B2211] font-serif">{a.id}</td>
                  <td className="px-6 py-4">{a.tipo}</td>
                  <td className="px-6 py-4">{a.raza}</td>
                  <td className="px-6 py-4">{a.edad}</td>
                  <td className="px-6 py-4">{a.peso}</td>
                  <td className="px-6 py-4">{getEstadoBadge(a.estado)}</td>
                  <td className="px-6 py-4 font-semibold">{a.precio}</td>
                  <td className="px-6 py-4 text-gray-500">{a.fecha}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      {/* Ver Detalles */}
                      <button onClick={() => abrirDetalle(a.id)} className="text-[#5C743D] hover:text-[#3B2211] transition-colors" title="Ver Detalles">
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {/* Editar */}
                      <button onClick={() => abrirEditar(a)} className="text-[#D97706] hover:text-[#3B2211] transition-colors" title="Editar Animal">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1 font-serif">Total Registrados</p>
          <p className="text-3xl font-bold text-[#3B2211] font-serif">8</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1 font-serif">Certificados</p>
          <p className="text-3xl font-bold text-[#5C743D] font-serif">5</p>
        </div>
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500 mb-1 font-serif">En Revisión</p>
          <p className="text-3xl font-bold text-[#D97706] font-serif">2</p>
        </div>
      </div>

      {/* Renderizado de todos los Modales */}
      <ModalDetalleAnimal 
        isOpen={isDetalleModalOpen}
        onClose={() => setIsDetalleModalOpen(false)}
        animalId={animalSeleccionadoId}
      />
      
      <ModalRegistrarAnimal 
        isOpen={isRegistrarModalOpen}
        onClose={() => setIsRegistrarModalOpen(false)}
      />
      
      <ModalEditarAnimal 
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        animalId={animalParaEditar?.id_display}
        dataActual={animalParaEditar}
      />

    </div>
  );
}
