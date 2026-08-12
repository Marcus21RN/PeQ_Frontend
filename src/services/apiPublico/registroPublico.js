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

export const registrarVeterinario = async (payload) => {
  const body = {
    ...payload,
    documentos: payload.documentos ?? payload.p_documentos ?? [],
    p_documentos: payload.p_documentos ?? payload.documentos ?? [],
  };

  const endpoints = [
    '/veterinario/registrar/',
    '/veterinario/register/',
    '/registro/veterinario/',
    '/veterinario/registro/',
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
  const body = {
    ...payload,
    documentos: payload.documentos ?? payload.p_documentos ?? [],
    p_documentos: payload.p_documentos ?? payload.documentos ?? [],
  };

  const endpoints = [
    '/registro-productor-traspatio/',
    '/traspatio/registrar/',
    '/traspatio/register/',
    '/registro/traspatio/',
    '/traspatio/registro/',
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
  const body = {
    ...payload,
    documentos: payload.documentos ?? payload.p_documentos ?? [],
    p_documentos: payload.p_documentos ?? payload.documentos ?? [],
  };

  const endpoints = [
    '/registro-productor-comercial/',
    '/comercial/registrar/',
    '/comercial/register/',
    '/registro/comercial/',
    '/comercial/registro/',
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
