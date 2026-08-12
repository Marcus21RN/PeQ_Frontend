import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import HeaderPublico from '../../components/publicoComponents/header.jsx';
import FooterPublico from '../../components/publicoComponents/footer.jsx';
import { getCategoriasGanado } from '../../services/apiPublico/ganadoPublico.js';

const categoryImages = {
  bovino: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1200&auto=format&fit=crop',
  porcino: 'https://mx.agroconsultar.com/images/cursoporcinos.jpg',
  ovino: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=1200&auto=format&fit=crop',
  caprino: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?q=80&w=1200&auto=format&fit=crop',
  aves: 'https://images.unsplash.com/photo-1548550023-2bf3c49b6b7a?q=80&w=1200&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1200&auto=format&fit=crop',
};

const getCategoryImage = (nombre) => {
  const key = String(nombre || '').toLowerCase();
  const match = Object.keys(categoryImages).find((category) => key.includes(category));
  return match ? categoryImages[match] : categoryImages.default;
};

export default function PublicoCatalogo() {
  const [categorias, setCategorias] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getCategoriasGanado()
      .then((data) => {
        if (!isMounted) return;
        setCategorias(data);
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setError('No se pudieron cargar las categorías de ganado.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categoriasFiltradas = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return categorias;

    return categorias.filter((categoria) => {
      const nombre = String(categoria.nombre || '').toLowerCase();
      const descripcion = String(categoria.descripcion || '').toLowerCase();
      return nombre.includes(query) || descripcion.includes(query);
    });
  }, [categorias, searchValue]);

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#2d1d12]">
      <HeaderPublico />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-3xl flex items-center gap-3 rounded-xl border border-[#d8d1c9] bg-white px-4 py-3 shadow-sm">
            <Search size={18} className="text-[#6f5c4f]" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Buscar por nombre del rancho..."
              className="w-full border-0 bg-transparent text-base text-[#43342d] placeholder:text-[#8a7a6f] outline-none"
            />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3a2417]">
            Sistema de Regulación y Control de Ganado
          </h2>
          <p className="mt-2 text-lg text-[#664f3d]">
            Seleccione un tipo de animal para ver el inventario certificado
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-lg text-[#5e473c]">Cargando categorías...</div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            {error}
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="rounded-2xl border border-[#d9d2cc] bg-white px-6 py-10 text-center text-[#5e473c]">
            No se encontraron categorías para esta búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categoriasFiltradas.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/publico/animales?categoria=${encodeURIComponent(categoria.nombre)}`}
                className="group rounded-2xl border border-[#d9d2cc] bg-[#f7f5f3] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative mb-5">
                  <img
                    src={getCategoryImage(categoria.nombre)}
                    alt={categoria.nombre}
                    className="h-36 w-full rounded-xl object-cover"
                  />
                  <span className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#5d7e2f] text-lg font-bold text-white shadow-md">
                    {categoria.total || 0}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#2b1c12]">{categoria.nombre}</h3>
                <p className="mt-2 text-base text-[#5f463b]">{categoria.descripcion}</p>
                <p className="mt-4 text-sm text-[#6e5a4b] group-hover:text-[#314d1b]">
                  Click para ver animales registrados
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <FooterPublico />
    </div>
  );
}
