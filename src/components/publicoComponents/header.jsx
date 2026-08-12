import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo3.png'; // Asegúrate de tener el logo en la carpeta assets
// Opcional: Importa tu logo si lo tienes en la carpeta assets


export default function HeaderPublico() {
  // Define aquí la URL base de tu WordPress local. 
  // Si tu WordPress está en una subcarpeta de htdocs, agrégala (ej: 'http://localhost/mi-wordpress')
  const wpBaseUrl = 'http://localhost/peq';

  return (
    <header className="sticky top-0 z-50 bg-white text-[#4c2d1d] border-b border-gray-100 font-serif">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
        <div className="flex items-center justify-between">
          
          {/* 1. SECCIÓN IZQUIERDA: LOGO */}
          <a href={`${wpBaseUrl}/`} className="flex items-center gap-2">
            <img src={logoImage} alt="Logo PeQ" className="h-10 object-contain " /> 
          </a>

          {/* 2. SECCIÓN CENTRAL: MENÚ DE NAVEGACIÓN */}
          {/* Se oculta en móviles (hidden lg:flex) para evitar que se amontone */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-bold">
            {/* Enlaces hacia WordPress usando <a> */}
            <a href={`${wpBaseUrl}/`} className="hover:text-[#8a6855] transition-colors">
              Inicio
            </a>
            <a href={`${wpBaseUrl}/sobre-nosotros`} className="hover:text-[#8a6855] transition-colors">
              Sobre Nosotros
            </a>
            <a href={`${wpBaseUrl}/servicios`} className="hover:text-[#8a6855] transition-colors">
              Servicios
            </a>
            <a href={`${wpBaseUrl}/contactanos`} className="hover:text-[#8a6855] transition-colors">
              Contáctanos
            </a>
            <a href={`${wpBaseUrl}/tienda`} className="hover:text-[#8a6855] transition-colors">
              Tienda
            </a>
            
            {/* Enlaces hacia tu App de React usando <Link> */}
            <Link to="/publico" className="hover:text-[#8a6855] transition-colors">
              Catálogo
            </Link>
            <Link to="/registrarse" className="hover:text-[#8a6855] transition-colors">
              Registrarse
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}