import { useState } from 'react';
import { X, Lock } from 'lucide-react';

export default function ModalCambiarContrasena({ isOpen, onClose }) {
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', confirmar: '' });
  const [error, setError] = useState('');

  // ==========================================
  // TODO: INTEGRACIÓN CON API (Backend)
  // ==========================================
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (passwords.nueva !== passwords.confirmar) {
  //     return setError('Las contraseñas nuevas no coinciden');
  //   }
  //   try {
  //     await api.put('/admin/perfil/contrasena', { 
  //       actual: passwords.actual, 
  //       nueva: passwords.nueva 
  //     });
  //     onClose(); // Cerrar al tener éxito
  //   } catch (err) {
  //     setError('Error al cambiar la contraseña. Verifica tu contraseña actual.');
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    console.log("Simulando cambio de contraseña...", passwords);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col font-serif" onClick={(e) => e.stopPropagation()}>
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900">Cambiar Contraseña</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Contraseña Actual</label>
            <input 
              type="password" 
              required
              value={passwords.actual}
              onChange={(e) => setPasswords({...passwords, actual: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Nueva Contraseña</label>
            <input 
              type="password" 
              required
              value={passwords.nueva}
              onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              required
              value={passwords.confirmar}
              onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A3B2A] outline-none" 
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#5A3B2A] text-white rounded-xl hover:bg-[#4A2F22] font-medium text-sm shadow-sm">Actualizar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
