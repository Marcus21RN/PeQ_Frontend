import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/authContext.jsx';

export default function Login() {
  // Estados para capturar los datos del formulario
  // NOTA: Aunque tu diseño dice "Correo Electrónico", la API de FastAPI (OAuth2) 
  // suele esperar el campo bajo el nombre "username". Lo enviaremos así.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const getRouteByRole = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'veterinario') return '/veterinario/dashboard';
    if (role === 'productor') return '/comercial/inicio';
    return '/admin/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Llamamos a la función de nuestro AuthContext que conecta con Render (FastAPI)
    const result = await login(username, password);

    if (result.success) {
      const role = result.user?.rol_nombre || result.user?.role || (result.user?.id_rol === 6 ? 'admin' : 'productor');
      navigate(getRouteByRole(role));
    } else {
      // Si falla, mostramos el error
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F0EA] p-4 font-serif">
      {/* Contenedor Principal (Tarjeta blanca) */}
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-150">
        
        {/* Mitad Izquierda - Imagen y Branding */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#336A32] relative p-12 text-white overflow-hidden justify-center">
          {/* Imagen de fondo de relleno (Vaca) con opacidad para mezclar con el verde */}
          <div 
            className="absolute inset-0 z-0 opacity-20 mix-blend-multiply bg-cover bg-center"
            
          ></div>

          <div className="relative z-10 flex flex-col gap-6">
            {/* Logo de relleno */}
            <div className="bg-white w-28 h-28 rounded-xl flex items-center justify-center p-2 shadow-lg">
              
            </div>
            
            <h1 className="text-4xl font-bold leading-tight mt-4">
              Sistema de Regulación <br /> Ganadero
            </h1>
            
            <p className="text-sm text-green-100 font-sans leading-relaxed max-w-sm">
              Plataforma integral para la certificación, trazabilidad y gestión de ganado con tecnología QR
            </p>
          </div>
        </div>

        {/* Mitad Derecha - Formulario de Login */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-500 text-sm font-sans">Ingresa tus datos para acceder</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-sans">
            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Input Correo / Username */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700 font-medium">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text" // Puede ser tipo email o text dependiendo de cómo inicie sesión el usuario en la BD
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#336A32] focus:border-[#336A32] outline-none transition-all text-gray-900"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700 font-medium">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#336A32] focus:border-[#336A32] outline-none transition-all text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Opciones extra */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-[#336A32] rounded border-gray-300 focus:ring-[#336A32]"
                />
                Recordarme
              </label>
              <a href="#" className="text-[#336A32] hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón de Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 mt-4 rounded-xl text-white font-medium transition-all ${
                isLoading 
                  ? 'bg-[#336A32]/70 cursor-not-allowed' 
                  : 'bg-[#336A32] hover:bg-[#285327] shadow-lg shadow-green-900/20'
              }`}
            >
              {isLoading ? 'Verificando datos...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
