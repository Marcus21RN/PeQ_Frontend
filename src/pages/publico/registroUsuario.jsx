import { useState } from 'react';
import { Building2, CheckCircle2, ChevronRight, House, Stethoscope, X } from 'lucide-react';
import HeaderPublico from '../../components/publicoComponents/header.jsx';
import FooterPublico from '../../components/publicoComponents/footer.jsx';
import RegistroVeterinarioModal from '../../components/publicoComponents/registroVeterinarioModal.jsx';
import RegistroTraspatioModal from '../../components/publicoComponents/registroTraspatioModal.jsx';
import RegistroComercialModal from '../../components/publicoComponents/registroComercialModal.jsx';

const roleOptions = [
  {
    id: 'veterinario',
    title: 'Veterinario Certificador',
    description: 'Para profesionales que certifican y verifican la salud del ganado',
    icon: Stethoscope,
    accent: 'bg-[#91a85b]',
    cardClass: 'bg-[#c4d39a]',
    badge: 'Límite: 10 animales grandes o 80 aves',
  },
  {
    id: 'traspatio',
    title: 'Rancho de Traspatio',
    description: 'Pequeños productores con crianza familiar y venta local',
    icon: House,
    accent: 'bg-[#e3e8d7]',
    cardClass: 'bg-[#edf1e4]',
    badge: 'Límite: 10 animales grandes o 80 aves',
  },
  {
    id: 'comercial',
    title: 'Rancho Comercial',
    description: 'Productores a gran escala con operaciones comerciales',
    icon: Building2,
    accent: 'bg-[#4d2c1d]',
    cardClass: 'bg-[#e7ddd8]',
    badge: 'Para más de 10 animales grandes o 80 aves',
  },
];

export default function RegistroUsuario() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const openRoleModal = (roleId) => {
    if (!['veterinario', 'traspatio', 'comercial'].includes(roleId)) {
      setToast({ type: 'info', message: `El registro de ${roleId} estará disponible próximamente.` });
      return;
    }

    setSelectedRole(roleId);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f1ee] text-[#2d1d12]">
      <HeaderPublico />

      <main className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="rounded-[26px] border border-[#d9d2cc] bg-[#f6f5f2] p-6 shadow-sm md:p-10">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-5xl font-bold text-[#2d1d12]">Selecciona tu tipo de registro</h2>
            <p className="mt-4 text-2xl italic text-[#6c564b]">Elige la categoría que mejor describa tu actividad</p>
          </div>

          {toast && (
            <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-[#d9d2cc] bg-[#edf4e6] px-4 py-3 text-[#2e4c1f]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
              <button type="button" onClick={() => setToast(null)} className="p-1 hover:opacity-80">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id && modalOpen;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => openRoleModal(role.id)}
                  className={`group flex min-h-107.5 flex-col items-center rounded-[22px] border bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                    isSelected ? 'border-[#6d8f3b] ring-2 ring-[#dfe9c6]' : 'border-[#d7d0c9]'
                  }`}
                >
                  <div className={`mb-6 flex h-28 w-28 items-center justify-center rounded-full ${role.accent} text-[#f7f5f2] shadow-inner`}>
                    <Icon size={46} strokeWidth={1.8} />
                  </div>

                  <h3 className="font-serif text-3xl font-bold text-[#2d1d12]">{role.title}</h3>
                  <p className="mt-4 max-w-xs text-base leading-relaxed text-[#5f463b]">{role.description}</p>

                  <div className="mt-6 w-full rounded-2xl border border-[#d7d0c9] bg-[#f5f2ee] px-3 py-3 text-sm font-medium text-[#2d1d12]">
                    {role.badge}
                  </div>

                  <div className="mt-auto pt-5 text-[#2d1d12]">
                    <ChevronRight size={28} className="opacity-70 transition group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <FooterPublico />

      {selectedRole === 'veterinario' && (
        <RegistroVeterinarioModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}

      {selectedRole === 'traspatio' && (
        <RegistroTraspatioModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}

      {selectedRole === 'comercial' && (
        <RegistroComercialModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}
    </div>
  );
}
