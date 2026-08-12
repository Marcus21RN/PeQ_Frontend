import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ListFilter, Search } from 'lucide-react';
import HeaderPublico from '../../components/publicoComponents/header.jsx';
import FooterPublico from '../../components/publicoComponents/footer.jsx';
import FichaTecnicaPublicoModal from '../../components/publicoComponents/fichaTecnicaModal.jsx';
import { getAnimalesPorCategoria } from '../../services/apiPublico/ganadoPublico.js';

const defaultImage = 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1200&auto=format&fit=crop';

export default function PublicoAnimales() {
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || 'Sin categoría';
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAnimalesPorCategoria(categoria)
      .then((data) => {
        if (!isMounted) return;
        setAnimales(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setError('No se pudieron cargar los animales de esta categoría.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoria]);

  const animalesFiltrados = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return animales;

    return animales.filter((animal) => {
      const values = [
        animal.nombre,
        animal.arete,
        animal.raza,
        animal.productor,
        animal.categoria,
        animal.estado,
      ]
        .filter(Boolean)
        .join(' ') 
        .toLowerCase();

      return values.includes(query);
    });
  }, [animales, searchValue]);

  const openModal = (animal) => {
    setSelectedAnimal(animal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnimal(null);
  };

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#2d1d12]">
      <HeaderPublico />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/publico"
            className="inline-flex items-center gap-2 rounded-lg border border-[#d8d0ca] bg-white px-4 py-2 text-sm font-medium text-[#462d1d] shadow-sm hover:bg-[#f9f8f7]"
          >
            <ArrowLeft size={16} />
            Volver a categorías
          </Link>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-3xl flex items-center gap-3 rounded-xl border border-[#d8d1c9] bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-[#6f5c4f]" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Buscar por nombre, arete o rancho..."
              className="w-full border-0 bg-transparent text-base text-[#43342d] placeholder:text-[#8a7a6f] outline-none"
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#2f1d14]">{categoria}</h2>
          <p className="mt-2 text-lg text-[#6b5447]">{animales.length} animales</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-lg text-[#5e473c]">Cargando animales...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            {error}
          </div>
        ) : animalesFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-[#d9d2cc] bg-white px-6 py-10 text-center text-[#5e473c]">
            No se encontraron animales para esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {animalesFiltrados.map((animal) => (
              <article
                key={animal.id || `${animal.arete}-${animal.nombre}`}
                className="rounded-2xl border border-[#d9d2cc] bg-[#f7f5f3] p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={animal.foto || defaultImage}
                      alt={animal.nombre}
                      className="h-16 w-16 rounded-lg object-cover border border-[#ddd5d0]"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-[#2a1a12]">{animal.nombre}</h3>
                      <p className="text-sm text-[#6b5447]">{animal.categoria}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#dfe9c6] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2a4930]">
                    {animal.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-[#3b2d26]">
                  <div>
                    <p className="text-[#7e665a]">Arete</p>
                    <p className="mt-1 font-semibold">{animal.arete}</p>
                  </div>
                  <div>
                    <p className="text-[#7e665a]">Raza</p>
                    <p className="mt-1 font-semibold">{animal.raza}</p>
                  </div>
                  <div>
                    <p className="text-[#7e665a]">Precio</p>
                    <p className="mt-1 font-semibold">{animal.precio}</p>
                  </div>
                  <div>
                    <p className="text-[#7e665a]">Edad</p>
                    <p className="mt-1 font-semibold">{animal.edad}</p>
                  </div>
                  <div>
                    <p className="text-[#7e665a]">Peso</p>
                    <p className="mt-1 font-semibold">{animal.peso}</p>
                  </div>
                  <div>
                    <p className="text-[#7e665a]">Sexo</p>
                    <p className="mt-1 font-semibold">{animal.sexo}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#ddd5d0] pt-4 text-sm text-[#4f3a2f]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Rancho:</span>
                    <span>{animal.productor}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-semibold">Certificado por:</span>
                    <span>{animal.certificadoPor}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openModal({
                    no_identificacion: animal.no_identificacion || animal.arete || animal.nombre,
                    raza: animal.raza,
                    categoria: animal.categoria,
                    sexo: animal.sexo,
                    edad: animal.edad,
                    peso_kg: animal.peso,
                    condicion_general: animal.estado,
                    proposito_produccion: 'Venta de ganado',
                    tiene_crias: false,
                    fecha_registro: null,
                    notas_adicionales: 'Sin notas adicionales.',
                    precio_venta: animal.precio,
                    nombre_rancho: animal.productor,
                    tipo_rancho: animal.tipoRancho || 'Sin tipo',
                    propietario: animal.productor,
                    contacto_propietario: 'Sin contacto registrado',
                    ubicacion_origen: 'Sin ubicación registrada',
                    certificado_por: animal.certificadoPor || 'Sin información',
                    cedula_profesional: 'Sin cédula registrada',
                    fecha_certificacion: null,
                    proxima_revision_sugerida: null,
                    historial_medico: [],
                  })}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4c2d1d] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#613c2c]"
                >
                  <ListFilter size={16} />
                  Ver ficha técnica
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      <FooterPublico />

      <FichaTecnicaPublicoModal
        isOpen={modalOpen}
        onClose={closeModal}
        animal={selectedAnimal || {}}
      />
    </div>
  );
}
