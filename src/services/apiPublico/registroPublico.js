import api from '../api.js';

export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/media/subir/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const buildDocumentPayload = (documents = []) => {
  const normalizedDocuments = Array.isArray(documents)
    ? documents
    : Object.entries(documents ?? {}).map(([key, value]) => ({
        tipo: key,
        url: value?.url,
        label: value?.label,
      }));

  return normalizedDocuments.map((doc) => {
    if (doc && typeof doc === 'object' && ('id_tipo_doc' in doc || 'url_archivo' in doc || 'nota' in doc)) {
      return {
        id_tipo_doc: doc.id_tipo_doc ?? 0,
        url_archivo: doc.url_archivo ?? doc.url ?? '',
        nota: doc.nota ?? doc.label ?? 'Documento',
      };
    }

    return {
      id_tipo_doc: 0,
      url_archivo: doc?.url_archivo ?? doc?.url ?? '',
      nota: doc?.label ?? doc?.tipo ?? 'Documento',
    };
  });
};

const buildRegistroBody = (payload, overrides = {}) => {
  const cleanPayload = { ...payload, ...overrides };
  delete cleanPayload.tipo_rol;
  delete cleanPayload.p_documentos;

  return {
    ...cleanPayload,
    documentos: buildDocumentPayload(cleanPayload.documentos ?? cleanPayload.p_documentos ?? []),
  };
};

export const registrarVeterinario = async (payload) => {
  const body = buildRegistroBody(payload);

  const endpoints = [
    '/registro-veterinario/',
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await api.post(endpoint, body);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No se pudo registrar el veterinario.');
};

export const registrarTraspatio = async (payload) => {
  const body = buildRegistroBody(payload, {
    nombre_granja: payload.nombre_granja ?? payload.nombre_rancho,
  });

  const endpoints = [
    '/registro-productor-traspatio/',
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await api.post(endpoint, body);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No se pudo registrar el productor de traspatio.');
};

export const registrarComercial = async (payload) => {
  const body = buildRegistroBody(payload, {
    nombre_rancho: payload.nombre_rancho ?? payload.nombre_granja,
  });

  const endpoints = [
    '/registro-ranchero-comercial/',
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await api.post(endpoint, body);
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No se pudo registrar el productor comercial.');
};

export default {
  uploadMediaFile,
  registrarVeterinario,
  registrarTraspatio,
  registrarComercial,
};
