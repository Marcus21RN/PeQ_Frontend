import api from '../api.js';

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const getArrayData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export const getCategoriasGanado = async () => {
  const response = await api.get('/catalogo-publico/estadisticas-certificacion/');
  const rows = getArrayData(response.data);

  return rows.map((item) => ({
    id: item?.id_categoria ?? item?.id ?? 0,
    nombre: item?.nombre_categoria ?? item?.nombre ?? 'Sin categoría',
    descripcion: 'Animales certificados',
    total: toNumber(item?.total_animales_certificados ?? item?.total ?? 0),
  }));
};

export const getAnimalesPorCategoria = async (categoria) => {
  const categorias = await getCategoriasGanado();

  const categoriaSeleccionada =
    typeof categoria === 'object'
      ? categoria
      : categorias.find((item) => String(item.nombre).toLowerCase() === String(categoria ?? '').toLowerCase());

  const categoriaId = categoriaSeleccionada?.id ?? categoria?.id_categoria ?? categoria;

  if (categoriaId === undefined || categoriaId === null || categoriaId === '') {
    return [];
  }

  const response = await api.get('/catalogo-publico/animales-certificados/', {
    params: {
      id_categoria: categoriaId,
      id_estado: 4,
    },
  });

  const rows = getArrayData(response.data);

  return rows.map((animal) => ({
    id: animal?.no_identificacion ?? animal?.id_animal ?? animal?.id ?? animal?.arete_id,
    nombre: animal?.no_identificacion ?? animal?.arete_id ?? 'Sin identificación',
    arete: animal?.no_identificacion ?? animal?.arete_id ?? 'Sin identificación',
    categoria: categoriaSeleccionada?.nombre ?? animal?.categoria ?? animal?.nombre_categoria ?? 'Sin categoría',
    raza: animal?.raza_animal ?? animal?.raza ?? 'Sin raza',
    sexo: animal?.genero ?? animal?.sexo ?? 'Sin sexo',
    edad: animal?.edad_anios ?? animal?.edad ?? 0,
    peso: animal?.peso_kg ?? animal?.peso ?? 0,
    estado: animal?.condicion ?? animal?.estado ?? animal?.estado_certificacion ?? 'Sin estado',
    precio: animal?.precio_venta ?? animal?.precio ?? 0,
    productor: animal?.nombre_rancho ?? animal?.rancho ?? 'Sin rancho',
    certificadoPor: animal?.certificado_por ?? animal?.certificadoPor ?? 'Sin información',
    foto: animal?.foto_url ?? animal?.foto ?? null,
    tipoRancho: animal?.tipo_rancho ?? animal?.tipoRancho ?? 'Sin tipo',
    condicion: animal?.condicion ?? 'Sin condición',
    no_identificacion: animal?.no_identificacion ?? animal?.arete_id ?? 'Sin identificación',
  }));
};

export const getFichaTecnicaPorAnimal = async (areteId) => {
  const identifier = String(areteId ?? '').trim();

  if (!identifier) {
    return {
      datos_base: null,
      historial_medico: [],
    };
  }

  const response = await api.get('/catalogo-publico/ficha-tecnica/', {
    params: {
      arete_id: identifier,
    },
  });

  const payload = response.data ?? {};
  const datosBase = payload?.datos_base ?? payload?.datosBase ?? null;
  const historialMedico = Array.isArray(payload?.historial_medico)
    ? payload.historial_medico
    : Array.isArray(payload?.historialMedico)
      ? payload.historialMedico
      : [];

  return {
    datos_base: datosBase,
    historial_medico: historialMedico,
  };
};

export default {
  getCategoriasGanado,
  getAnimalesPorCategoria,
  getFichaTecnicaPorAnimal,
};
