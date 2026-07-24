import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar.jsx';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Área de contenido principal que ocupa el resto de la pantalla */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};
