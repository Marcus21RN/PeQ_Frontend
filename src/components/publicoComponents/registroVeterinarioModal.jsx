import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  GraduationCap,
  House,
  IdCard,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  Upload,
  User,
  X,
} from 'lucide-react';
import { uploadMediaFile, registrarVeterinario } from '../../services/apiPublico/registroPublico.js';

const requiredFields = [
  'nombre',
  'apellido_paterno',
  'apellido_materno',
  'email',
  'telefono',
  'ciudad',
  'usuario',
  'password',
  'cedula_profesional',
  'especialidad',
  'universidad',
];

const documentLabels = {
  cedula_profesional: 'Cédula Profesional',
  ine: 'Identificación Oficial (INE/Pasaporte)',
  comprobante_domicilio: 'Comprobante de Domicilio',
  certificado_especialidad: 'Certificado de Especialización (Opcional)',
  carta_antecedentes: 'Carta de Antecedentes No Penales',
};

const initialForm = {
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  email: '',
  telefono: '',
  ciudad: '',
  usuario: '',
  password: '',
  cedula_profesional: '',
  especialidad: '',
  universidad: '',
};

const initialDocuments = {
  cedula_profesional: null,
  ine: null,
  comprobante_domicilio: null,
  certificado_especialidad: null,
  carta_antecedentes: null,
};

const sanitizeTextOnly = (value) => value.replace(/\d/g, '').replace(/[^A-Za-zÀ-ÿÑñ\s.'-]/g, '');
const sanitizeCity = (value) => value.replace(/\d/g, '').replace(/[^A-Za-zÀ-ÿÑñ\s.'-]/g, '');
const sanitizePhone = (value) => value.replace(/[^\d+\-\s()]/g, '').slice(0, 20);
const sanitizeUser = (value) => value.replace(/\s/g, '').replace(/[^A-Za-z0-9._-]/g, '').slice(0, 50);
const sanitizeNumeric = (value, allowDecimal = false) => {
  const restricted = allowDecimal ? value.replace(/[^\d.]/g, '') : value.replace(/\D/g, '');

  if (!allowDecimal) {
    return restricted;
  }

  const parts = restricted.split('.');
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`;
  }

  return restricted;
};

const normalizeFieldValue = (field, value) => {
  switch (field) {
    case 'nombre':
    case 'apellido_paterno':
    case 'apellido_materno':
      return sanitizeTextOnly(value);
    case 'ciudad':
      return sanitizeCity(value);
    case 'telefono':
      return sanitizePhone(value);
    case 'usuario':
      return sanitizeUser(value);
    case 'password':
      return value.slice(0, 60);
    case 'capacidad_animales':
      return sanitizeNumeric(value, false);
    case 'superficie_hectareas':
      return sanitizeNumeric(value, true);
    default:
      return value;
  }
};

export default function RegistroVeterinarioModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [documents, setDocuments] = useState(initialDocuments);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast, isOpen]);

  const steps = useMemo(
    () => [
      { title: 'Datos Personales', subtitle: 'Completa la información requerida' },
      { title: 'Documentación', subtitle: 'Adjunta los documentos requeridos' },
      { title: 'Confirmación', subtitle: 'Revisa y finaliza tu registro' },
    ],
    []
  );

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep, steps.length]);

  const updateField = (field, value) => {
    const sanitized = normalizeFieldValue(field, value);
    setFormData((prev) => ({ ...prev, [field]: sanitized }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadMediaFile(file);
      setDocuments((prev) => ({ ...prev, [field]: file }));
      setUploadedFiles((prev) => ({
        ...prev,
        [field]: {
          key: field,
          label: documentLabels[field] || 'Documento',
          fileName: file.name,
          url: response?.secure_url || response?.url || '',
          public_id: response?.public_id || '',
          mime_type: response?.mime_type || file.type,
          resource_type: response?.resource_type || 'image',
        },
      }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
      setToast({ type: 'success', message: `${documentLabels[field]} cargado correctamente.` });
    } catch (error) {
      setToast({ type: 'error', message: 'No se pudo subir el documento. Intenta nuevamente.' });
      console.error(error);
    }
  };

  const validateStepOne = () => {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      const value = String(formData[field] ?? '').trim();
      if (!value) {
        nextErrors[field] = 'Este campo es obligatorio';
      }
    });

    const textFields = ['nombre', 'apellido_paterno', 'apellido_materno', 'ciudad'];
    textFields.forEach((field) => {
      const value = String(formData[field] ?? '').trim();
      if (value && !/^[A-Za-zÀ-ÿÑñ\s.'-]+$/.test(value)) {
        nextErrors[field] = 'Solo se permiten letras y espacios';
      }
    });

    if (formData.telefono && !/^[0-9+\-\s()]{7,20}$/.test(formData.telefono.trim())) {
      nextErrors.telefono = 'Ingresa un teléfono válido';
    }

    if (formData.usuario && !/^[A-Za-z0-9._-]{4,50}$/.test(formData.usuario.trim())) {
      nextErrors.usuario = 'Usa 4 a 50 caracteres: letras, números, . _ -';
    }

    if (formData.password && formData.password.length < 8) {
      nextErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.capacidad_animales !== undefined && formData.capacidad_animales !== '' && !/^\d+$/.test(String(formData.capacidad_animales).trim())) {
      nextErrors.capacidad_animales = 'Solo se permiten números';
    }

    if (formData.superficie_hectareas !== undefined && formData.superficie_hectareas !== '' && !/^\d+(\.\d+)?$/.test(String(formData.superficie_hectareas).trim())) {
      nextErrors.superficie_hectareas = 'Solo se permiten números';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Ingresa un correo válido';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStepTwo = () => {
    const missing = Object.entries(documentLabels)
      .filter(([key]) => key !== 'certificado_especialidad')
      .filter(([key]) => !uploadedFiles[key])
      .map(([_, label]) => label);

    if (missing.length) {
      setToast({ type: 'error', message: 'Faltan documentos obligatorios por subir.' });
      return false;
    }

    return true;
  };

  const onNext = () => {
    if (currentStep === 0 && !validateStepOne()) return;
    if (currentStep === 1 && !validateStepTwo()) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const onBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    if (!validateStepOne()) {
      setCurrentStep(0);
      return;
    }

    if (!validateStepTwo()) {
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        email: formData.email,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        usuario: formData.usuario,
        password: formData.password,
        cedula_profesional: formData.cedula_profesional,
        especialidad: formData.especialidad,
        universidad: formData.universidad,
        documentos: Object.entries(uploadedFiles).map(([key, value]) => ({
          id_tipo_doc: 0,
          url_archivo: value.url || '',
          nota: value.label || key,
        })),
      };

      await registrarVeterinario(payload);
      setToast({ type: 'success', message: 'Registro exitoso. El veterinario fue registrado correctamente.' });
      setFormData(initialForm);
      setUploadedFiles({});
      setDocuments(initialDocuments);
      setCurrentStep(0);

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: 'Hubo un problema con el registro. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1d12]/50 px-4 py-6 backdrop-blur-[1px]">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[18px] border border-[#d9d2cc] bg-[#f5f2ee] shadow-2xl">
        <div className="flex items-center justify-between bg-[#2c1405] px-6 py-4 text-white">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-wide">Veterinario Certificador</h2>
            <p className="text-xs text-[#eadfd2]">Registro de cuenta y documentación</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/5 p-2 transition hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-[#2b1c12]">{steps[currentStep].title}</p>
              <p className="text-sm text-[#6f5649]">{steps[currentStep].subtitle}</p>
            </div>
            <div className="rounded-full bg-[#dfe9c6] px-3 py-1 text-sm font-bold text-[#2f4b1d]">
              Paso {currentStep + 1} de {steps.length}
            </div>
          </div>

          <div className="mb-6 h-3 overflow-hidden rounded-full bg-[#e8e1dc]">
            <div
              className="h-full rounded-full bg-[#6c8b3b] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {toast && (
            <div
              className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                toast.type === 'success'
                  ? 'border-[#b8d39f] bg-[#edf7dd] text-[#2e4c1f]'
                  : 'border-[#f1c7bc] bg-[#fef1ee] text-[#7d3b2d]'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
              <span>{toast.message}</span>
            </div>
          )}

          {currentStep === 0 && (
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nombre (s)" icon={<User size={15} />} required>
                  <input
                    value={formData.nombre}
                    onChange={(event) => updateField('nombre', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="Juan Carlos"
                  />
                  {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}
                </Field>

                <Field label="Correo Electrónico" icon={<Mail size={15} />} required>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && <ErrorText>{errors.email}</ErrorText>}
                </Field>

                <Field label="Apellido Paterno" icon={<User size={15} />} required>
                  <input
                    value={formData.apellido_paterno}
                    onChange={(event) => updateField('apellido_paterno', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="Pérez"
                  />
                  {errors.apellido_paterno && <ErrorText>{errors.apellido_paterno}</ErrorText>}
                </Field>

                <Field label="Apellido Materno" icon={<User size={15} />} required>
                  <input
                    value={formData.apellido_materno}
                    onChange={(event) => updateField('apellido_materno', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="García"
                  />
                  {errors.apellido_materno && <ErrorText>{errors.apellido_materno}</ErrorText>}
                </Field>

                <Field label="Teléfono" icon={<Phone size={15} />} required>
                  <input
                    value={formData.telefono}
                    onChange={(event) => updateField('telefono', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="555-123-4567"
                  />
                  {errors.telefono && <ErrorText>{errors.telefono}</ErrorText>}
                </Field>

                <Field label="Ciudad" icon={<MapPin size={15} />} required>
                  <input
                    value={formData.ciudad}
                    onChange={(event) => updateField('ciudad', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="Guadalajara"
                  />
                  {errors.ciudad && <ErrorText>{errors.ciudad}</ErrorText>}
                </Field>

                <Field label="Usuario" icon={<BadgeCheck size={15} />} required>
                  <input
                    value={formData.usuario}
                    onChange={(event) => updateField('usuario', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="juan.veterinario"
                  />
                  {errors.usuario && <ErrorText>{errors.usuario}</ErrorText>}
                </Field>

                <Field label="Contraseña" icon={<LockKeyhole size={15} />} required>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="••••••••"
                  />
                  {errors.password && <ErrorText>{errors.password}</ErrorText>}
                </Field>

                <Field label="Cédula Profesional" icon={<IdCard size={15} />} required>
                  <input
                    value={formData.cedula_profesional}
                    onChange={(event) => updateField('cedula_profesional', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="12345678"
                  />
                  {errors.cedula_profesional && <ErrorText>{errors.cedula_profesional}</ErrorText>}
                </Field>

                <Field label="Especialidad" icon={<Stethoscope size={15} />} required>
                  <input
                    value={formData.especialidad}
                    onChange={(event) => updateField('especialidad', event.target.value)}
                    className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                    placeholder="Medicina Veterinaria y Zootecnia"
                  />
                  {errors.especialidad && <ErrorText>{errors.especialidad}</ErrorText>}
                </Field>

                <div className="md:col-span-2">
                  <Field label="Universidad" icon={<GraduationCap size={15} />} required>
                    <input
                      value={formData.universidad}
                      onChange={(event) => updateField('universidad', event.target.value)}
                      className="w-full rounded-xl border border-[#d7d0c9] bg-[#f8f6f4] px-4 py-3 text-base text-[#2b1c12] outline-none transition focus:border-[#6b8c3a]"
                      placeholder="Universidad Nacional Autónoma de México"
                    />
                    {errors.universidad && <ErrorText>{errors.universidad}</ErrorText>}
                  </Field>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#d8d1c9] bg-[#f9f7f5] p-4 text-sm text-[#4f3a2f]">
                <div className="flex items-center gap-2 text-[#2d1d12]">
                  <ShieldCheck size={18} />
                  <span className="font-semibold">Importante</span>
                </div>
                <p className="mt-2">
                  Todos los documentos deben estar en formato PDF, JPG o PNG y no exceder 5MB.
                </p>
              </div>

              {Object.entries(documentLabels).map(([key, label]) => (
                <div key={key} className="rounded-2xl border border-[#d7d0c9] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-[#2c1b12]">
                      <div className="rounded-lg bg-[#f0efe9] p-2">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{label}</p>
                        <p className="text-xs text-[#7d665d]">
                          {uploadedFiles[key] ? uploadedFiles[key].fileName : 'Sin archivo cargado'}
                        </p>
                      </div>
                    </div>

                    <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#b9b0a7] bg-[#f8f6f4] px-4 py-2 text-sm font-semibold text-[#342218] transition hover:bg-[#f1eee9]">
                      <Upload size={16} className="mr-2" />
                      Cargar
                      <input type="file" className="hidden" onChange={(event) => handleFileChange(event, key)} />
                    </label>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-[#d8d1c9] bg-[#edf4e6] p-4 text-sm font-medium text-[#314b20]">
                Progreso de documentación: {Object.keys(uploadedFiles).length} de {Object.keys(documentLabels).length}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#d7d0c9] bg-[#ffffff] p-5 shadow-sm">
                <h3 className="mb-4 text-xl font-bold text-[#2b1c12]">Resumen del registro</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoRow label="Nombre" value={`${formData.nombre} ${formData.apellido_paterno} ${formData.apellido_materno}`.trim()} />
                  <InfoRow label="Correo" value={formData.email} />
                  <InfoRow label="Teléfono" value={formData.telefono} />
                  <InfoRow label="Ciudad" value={formData.ciudad} />
                  <InfoRow label="Usuario" value={formData.usuario} />
                  <InfoRow label="Cédula" value={formData.cedula_profesional} />
                  <InfoRow label="Especialidad" value={formData.especialidad} />
                  <InfoRow label="Universidad" value={formData.universidad} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7d0c9] bg-[#ffffff] p-5 shadow-sm">
                <h4 className="mb-3 text-lg font-bold text-[#2b1c12]">Documentos cargados</h4>
                <div className="space-y-2">
                  {Object.values(uploadedFiles).map((doc) => (
                    <div key={doc.key} className="flex items-center justify-between rounded-xl bg-[#f5f2ee] px-3 py-2 text-sm text-[#342218]">
                      <span>{doc.label}</span>
                      <span className="font-semibold text-[#2e4c1f]">Cargado</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#c9c1b9] bg-white px-5 py-3 text-base font-semibold text-[#352419] transition hover:bg-[#f8f5f3]"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#c9c1b9] bg-white px-5 py-3 text-base font-semibold text-[#352419] transition hover:bg-[#f8f5f3]"
                >
                  <ChevronLeft size={18} />
                  Regresar
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5c7b31] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#486727]"
                >
                  Continuar
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5c7b31] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#486727] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Registrando...' : 'Enviar Registro'}
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, icon, children }) {
  return (
    <label className="block text-[#2c1b12]">
      <div className="mb-2 flex items-center gap-2 text-base font-semibold">
        <span className="text-[#5b7f2d]">{icon}</span>
        <span>{label}</span>
        {required && <span className="text-[#8a5f4c]">*</span>}
      </div>
      {children}
    </label>
  );
}

function ErrorText({ children }) {
  return <p className="mt-2 text-xs font-medium text-[#8a4a3b]">{children}</p>;
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl border border-[#e3dcd7] bg-[#f8f6f4] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6f5649]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#2d1d12]">{value || 'No especificado'}</p>
    </div>
  );
}
