// services/pagos/paymentMethodService.ts
import { axiosInstance } from "../axiosConfig";

export interface MetodoPago {
  id: number;
  tipo: string;
  categoria: string;
  descripcion?: string;
  requiere_pasarela: boolean;
  activo: boolean;
}

export interface ListParams {
  tipo?: string;
  categoria?: string;
  requiere_pasarela?: boolean;
  activo?: boolean;
  search?: string;
}

const API_URL = "/api/pagos";

export const paymentMethodService = {
  async list(params?: ListParams) {
    return axiosInstance.get(`${API_URL}/`, { params });
  },

  async create(data: Partial<MetodoPago>) {
    return axiosInstance.post(`${API_URL}/`, data);
  },

  async update(id: number, data: Partial<MetodoPago>) {
    return axiosInstance.put(`${API_URL}/${id}/`, data);
  },

  async deactivate(id: number) {
    return axiosInstance.delete(`${API_URL}/${id}/`);
  },

  async activate(id: number) {
    return axiosInstance.post(`${API_URL}/${id}/activar/`);
  },
};