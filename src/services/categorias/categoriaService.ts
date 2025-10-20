// services/categorias/categoriaService.ts
import { axiosInstance } from "../axiosConfig";

// Tipo base de Categoría
export interface Categoria {
  id_categoria: number;
  nombre: string;
  id_catpadre?: number | null;
  estado_categoria?: "ACTIVA" | "INACTIVA";
  cantidad_productos: number;
  subcategorias: Categoria[];
}

const API_URL = "/api/categorias";

export const CategoriaService = {
  // === Listado jerárquico ===
  async listar_arbol(): Promise<Categoria[]> {
    const res = await axiosInstance.get(`${API_URL}/listar_arbol/`);
     return Array.isArray(res.data) ? res.data : res.data.categorias ?? [];
  },

  // === Crear categoría ===
  async crear(data: Partial<Categoria>) {
    return axiosInstance.post(`${API_URL}/`, data);
  },

  // === Actualizar ===
  async actualizar(id: number, data: Partial<Categoria>) {
    return axiosInstance.put(`${API_URL}/${id}/`, data);
  },

  // === Eliminar ===
  async eliminar(id: number) {
    return axiosInstance.delete(`${API_URL}/${id}/`);
  },

  // === Mover categoría ===
  async mover(id: number, nuevoPadre: number | null, motivo: string) {
    return axiosInstance.post(`${API_URL}/${id}/mover/`, {
      nuevo_padre: nuevoPadre,
      motivo,
    });
  },

  // === Estadísticas ===
  async estadisticas() {
    return axiosInstance.get(`${API_URL}/estadisticas/`);
  },
};
