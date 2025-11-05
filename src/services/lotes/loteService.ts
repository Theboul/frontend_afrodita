import api from "../api";

export interface LoteData {
  id_lote: string;
  producto: string;
  cantidad: number;
  fecha_vencimiento: string;
}

const BASE_URL = "/api/lotes/";

// Obtener todos los lotes
export const getLotes = async () => {
  const response = await api.get(BASE_URL);
  if (Array.isArray(response.data)) return response.data;
  return response.data.results || [];
};

// Crear nuevo lote
export const createLote = async (data: LoteData) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

// Actualizar lote
export const updateLote = async (id: string, data: LoteData) => {
  const response = await api.put(`${BASE_URL}${id}/`, data);
  return response.data;
};

// Eliminar lote
export const deleteLote = async (id: string) => {
  const response = await api.delete(`${BASE_URL}${id}/`);
  return response.data;
};
