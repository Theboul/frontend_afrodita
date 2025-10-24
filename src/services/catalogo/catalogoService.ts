// src/services/catalogoService.ts
import { axiosInstance } from '../axiosConfig';

const BASE_URL = '/api/catalogo';

export const catalogoService = {
  /** Filtros generales (categorías, colores, medidas) */
  async obtenerFiltros() {
    const res = await axiosInstance.get(`${BASE_URL}/filtros/`);
    return res.data;
  },

  /** Colores por categoría */
  async obtenerColoresPorCategoria(idCategoria: number) {
    const res = await axiosInstance.get(`${BASE_URL}/colores-por-categoria/`, {
      params: { categoria: idCategoria },
    });
    return res.data;
  },

  /** Medidas dependientes por color (y opcional categoría) */
  async obtenerMedidasPorColor(color: string, categoria?: number) {
    const res = await axiosInstance.get(`${BASE_URL}/medidas-por-color/`, {
      params: { color, categoria },
    });
    return res.data;
  },

  /** Buscar productos filtrando */
  async buscarProductos(params: {
    categoria?: number;
    color?: string;
    medida?: number;
    search?: string;
    precio_min?: number;
    precio_max?: number;
    orden?: string;
    page?: number;
    page_size?: number;
  }) {
    const res = await axiosInstance.get(`${BASE_URL}/productos/`, { params });
    return res.data;
  },

  /** Detalle de un producto */
  async obtenerDetalle(idProducto: string) {
    const res = await axiosInstance.get(`${BASE_URL}/productos/${idProducto}/`);
    return res.data;
  },

  /** Estadísticas globales */
  async obtenerEstadisticas() {
    const res = await axiosInstance.get(`${BASE_URL}/estadisticas/`);
    return res.data;
  },
};
