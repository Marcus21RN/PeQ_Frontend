import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeaderPublico() {
  return (
    <header className="bg-[#4c2d1d] text-[#f4efe9] shadow-md">
      <div className="max-w-6xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">
              Sistema de Regulación y Control de Ganado
            </h1>
            <p className="mt-1 text-sm md:text-base italic text-[#eae0d8]">
              Verifica, confirma y compra
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f2f0ec] px-4 py-2 text-sm font-medium text-[#2d1a10] shadow-sm transition hover:bg-white"
          >
            <Home size={16} />
            Inicio
          </Link>
        </div>
      </div>
    </header>
  );
}
