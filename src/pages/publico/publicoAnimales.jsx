import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ListFilter, Search, Grid2x2, TableProperties } from 'lucide-react';
import HeaderPublico from '../../components/publicoComponents/header.jsx';
import FooterPublico from '../../components/publicoComponents/footer.jsx';
import FichaTecnicaPublicoModal from '../../components/publicoComponents/fichaTecnicaModal.jsx';
import { getAnimalesPorCategoria } from '../../services/apiPublico/ganadoPublico.js';

const defaultImage = 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1200&auto=format&fit=crop';

const animalCategoryImages = {
  bovino: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200&auto=format&fit=crop',
  porcino: 'https://mx.agroconsultar.com/images/cursoporcinos.jpg',
  ovino: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=1200&auto=format&fit=crop',
  caprino: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=1200&auto=format&fit=crop',
  aves: 'https://images.unsplash.com/photo-1548550023-2bf3c49b6b7a?q=80&w=1200&auto=format&fit=crop',
  gallina: 'https://images.unsplash.com/photo-1548550023-2bf3c49b6b7a?q=80&w=1200&auto=format&fit=crop',
  pollo: 'https://images.unsplash.com/photo-1548550023-2bf3c49b6b7a?q=80&w=1200&auto=format&fit=crop',
};

const getAnimalImage = (animal) => {
  if (animal?.foto) {
    return animal.foto;
  }

  const categoryKey = String(animal?.categoria || animal?.nombre_categoria || '').toLowerCase();
  const matchedKey = Object.keys(animalCategoryImages).find((key) => categoryKey.includes(key));

  return matchedKey ? animalCategoryImages[matchedKey] : defaultImage;
};

const normalizeRanchoType = (value) => {
  const normalized = String(value ?? '').toLowerCase();
  if (normalized.includes('traspatio')) return 'traspatio';
  if (normalized.includes('comercial')) return 'comercial';
  return 'todos';
};

export default function PublicoAnimales() {
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get('categoria') || 'Sin categoría';
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [selectedRanchoType, setSelectedRanchoType] = useState('todos');
  const [viewMode, setViewMode] = useState('cards');
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

    return animales.filter((animal) => {
      const ranchoType = normalizeRanchoType(animal.tipo_rancho ?? animal.tipoRancho ?? animal.productor ?? '');
      if (selectedRanchoType !== 'todos' && ranchoType !== selectedRanchoType) {
        return false;
      }

      if (!query) return true;

      const values = [
        animal.nombre,
        animal.arete,
        animal.raza,
        animal.productor,
        animal.categoria,
        animal.estado,
        animal.nombre_rancho,
        animal.propietario,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return values.includes(query);
    });
  }, [animales, searchValue, selectedRanchoType]);

  const openModal = async (animal) => {
    const identifier = animal?.no_identificacion ?? animal?.arete ?? animal?.id;

    if (!identifier) {
      setSelectedAnimal(animal);
      setModalOpen(true);
      return;
    }

    try {
      const ficha = await import('../../services/apiPublico/ganadoPublico.js').then(({ getFichaTecnicaPorAnimal }) => getFichaTecnicaPorAnimal(identifier));
      const datosBase = ficha?.datos_base ?? ficha ?? animal;
      setSelectedAnimal({
        ...animal,
        ...datosBase,
        nombre_rancho: datosBase?.nombre_rancho ?? animal?.nombre_rancho ?? animal?.productor,
        propietario: datosBase?.propietario ?? animal?.propietario ?? animal?.productor,
        ubicacion_origen: datosBase?.ubicacion_origen ?? animal?.ubicacion_origen ?? 'Sin ubicación registrada',
        contacto_propietario: datosBase?.contacto_propietario ?? animal?.contacto_propietario ?? 'Sin contacto registrado',
        tipo_rancho: datosBase?.tipo_rancho ?? animal?.tipo_rancho ?? animal?.tipoRancho,
      });
    } catch (error) {
      setSelectedAnimal({
        ...animal,
        nombre_rancho: animal?.nombre_rancho ?? animal?.productor,
        propietario: animal?.propietario ?? animal?.productor,
        ubicacion_origen: animal?.ubicacion_origen ?? 'Sin ubicación registrada',
        contacto_propietario: animal?.contacto_propietario ?? 'Sin contacto registrado',
      });
    } finally {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnimal(null);
  };

  return (
    <div className="min-h-screen bg-[#ffff] text-[#2d1d12]">
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

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {[
              { value: 'todos', label: 'Todos los animales' },
              { value: 'comercial', label: 'Ranchos Comerciales' },
              { value: 'traspatio', label: 'Ranchos de Traspatio' },
            ].map((option) => {
              const active = selectedRanchoType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRanchoType(option.value)}
                  className={`inline-flex items-center justify-center rounded-xl border px-5 py-3 text-base font-semibold transition ${
                    active
                      ? 'border-[#5c7b31] bg-[#a8ba70] text-[#233318] shadow-sm'
                      : 'border-[#d8d1c9] bg-white text-[#4a2d1d] hover:bg-[#f9f7f5]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full max-w-3xl flex items-center gap-3 rounded-xl border border-[#d8d1c9] bg-white px-4 py-3 shadow-sm">
              <Search size={18} className="text-[#6f5c4f]" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Buscar por nombre, arete o rancho..."
                className="w-full border-0 bg-transparent text-base text-[#43342d] placeholder:text-[#8a7a6f] outline-none"
              />
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="text-sm font-semibold uppercase tracking-wide text-[#6e5a4b]">Vista</span>
              <div className="flex items-center gap-2 rounded-xl border border-[#d8d1c9] bg-white p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    viewMode === 'cards' ? 'bg-[#5c7b31] text-white' : 'text-[#4a2d1d] hover:bg-[#f5f3ef]'
                  }`}
                >
                  <Grid2x2 size={16} />
                  Tarjetas
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    viewMode === 'table' ? 'bg-[#5c7b31] text-white' : 'text-[#4a2d1d] hover:bg-[#f5f3ef]'
                  }`}
                >
                  <TableProperties size={16} />
                  Tabla
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-[#2f1d14]">{categoria}</h2>
          <p className="mt-2 text-lg text-[#6b5447]">{animalesFiltrados.length} animales</p>
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
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {animalesFiltrados.map((animal) => (
              <article
                key={animal.id || `${animal.arete}-${animal.nombre}`}
                className="rounded-2xl border border-[#d9d2cc] bg-[#ffff] p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAnimalImage(animal)}
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
                    nombre_rancho: animal.nombre_rancho ?? animal.productor,
                    tipo_rancho: animal.tipo_rancho ?? animal.tipoRancho ?? 'Sin tipo',
                    propietario: animal.propietario ?? animal.productor,
                    contacto_propietario: animal.contacto_propietario ?? 'Sin contacto registrado',
                    ubicacion_origen: animal.ubicacion_origen ?? 'Sin ubicación registrada',
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
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#d9d2cc] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-[#f3efe9] text-[#3a2417]">
                  <tr>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Animal</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Arete</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Raza</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Sexo</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Peso</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Rancho</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Precio</th>
                    <th className="px-5 py-4 text-sm font-bold uppercase tracking-wide">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {animalesFiltrados.map((animal) => (
                    <tr key={animal.id || `${animal.arete}-${animal.nombre}`} className="border-t border-[#e9e1db]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAnimalImage(animal)}
                            alt={animal.nombre}
                            className="h-11 w-11 rounded-lg border border-[#ddd5d0] object-cover"
                          />
                          <div>
                            <p className="text-base font-bold text-[#2a1a12]">{animal.nombre}</p>
                            <p className="text-xs text-[#6b5447]">{animal.categoria}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[#3b2d26]">{animal.arete}</td>
                      <td className="px-5 py-4 text-sm text-[#3b2d26]">{animal.raza}</td>
                      <td className="px-5 py-4 text-sm text-[#3b2d26]">{animal.sexo}</td>
                      <td className="px-5 py-4 text-sm text-[#3b2d26]">{animal.peso} kg</td>
                      <td className="px-5 py-4 text-sm text-[#3b2d26]">{animal.productor}</td>
                      <td className="px-5 py-4 text-sm font-bold text-[#2a4930]">${Number(animal.precio || 0).toLocaleString('es-MX')}</td>
                      <td className="px-5 py-4">
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
                            nombre_rancho: animal.nombre_rancho ?? animal.productor,
                            tipo_rancho: animal.tipo_rancho ?? animal.tipoRancho ?? 'Sin tipo',
                            propietario: animal.propietario ?? animal.productor,
                            contacto_propietario: animal.contacto_propietario ?? 'Sin contacto registrado',
                            ubicacion_origen: animal.ubicacion_origen ?? 'Sin ubicación registrada',
                            certificado_por: animal.certificadoPor || 'Sin información',
                            cedula_profesional: 'Sin cédula registrada',
                            fecha_certificacion: null,
                            proxima_revision_sugerida: null,
                            historial_medico: [],
                          })}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#4c2d1d] px-3 py-2 text-sm font-semibold text-white hover:bg-[#613c2c]"
                        >
                          <ListFilter size={14} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
