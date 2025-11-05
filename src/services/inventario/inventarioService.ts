import api from "../api";

export interface InventarioData {
  producto: string;
  cantidad_actual: number;
  stock_minimo: number;
  ubicacion: string;
}

const BASE_URL = "/api/inventario/inventario/";

export const getInventario = async () => {
  const response = await api.get(BASE_URL);
  if (Array.isArray(response.data)) return response.data;
  return response.data.results || [];
};

export const createInventario = async (data: InventarioData) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

export const updateInventario = async (id: number, data: InventarioData) => {
  const response = await api.put(`${BASE_URL}${id}/`, data);
  return response.data;
};

export const deleteInventario = async (id: number) => {
  const response = await api.delete(`${BASE_URL}${id}/`);
  return response.data;
};
