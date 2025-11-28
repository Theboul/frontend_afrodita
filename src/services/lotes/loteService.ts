import { axiosInstance } from "../axiosConfig";

export interface LoteData {
  id_lote: string;
  producto: string;
  cantidad: number;
  fecha_vencimiento: string;
}

const BASE_URL = "/api/lotes/";

const extractList = (res: any) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.results)) return res.data.results;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

// Obtener todos los lotes
export const getLotes = async () => {
  const response = await axiosInstance.get(BASE_URL);
  return extractList(response);
};

// Crear nuevo lote
export const createLote = async (data: LoteData) => {
  const response = await axiosInstance.post(BASE_URL, data);
  return response.data;
};

// Actualizar lote
export const updateLote = async (id: string, data: LoteData) => {
  const response = await axiosInstance.put(`${BASE_URL}${id}/`, data);
  return response.data;
};

// Eliminar lote
export const deleteLote = async (id: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}${id}/`);
  return response.data;
};
