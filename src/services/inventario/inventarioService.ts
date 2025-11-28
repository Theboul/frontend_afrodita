import { axiosInstance } from "../axiosConfig";

export interface InventarioData {
  producto: string;
  cantidad_actual: number;
  stock_minimo: number;
  ubicacion: string;
}

const BASE_URL = "/api/inventario/inventario/";

const extractList = (res: any) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.results)) return res.data.results;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

export const getInventario = async () => {
  const response = await axiosInstance.get(BASE_URL);
  return extractList(response);
};

export const createInventario = async (data: InventarioData) => {
  const response = await axiosInstance.post(BASE_URL, data);
  return response.data;
};

export const updateInventario = async (id: number, data: InventarioData) => {
  const response = await axiosInstance.put(`${BASE_URL}${id}/`, data);
  return response.data;
};

export const deleteInventario = async (id: number) => {
  const response = await axiosInstance.delete(`${BASE_URL}${id}/`);
  return response.data;
};
