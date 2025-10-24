import { axiosInstance } from "../axiosConfig";

export interface Producto {
  imagen_principal: any;
  id_producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado_producto?: string;
  id_categoria: string;
  id_configuracion?: string | null;
}

export interface Categoria {
  id_categoria: string;
  nombre: string;
  subcategorias?: Categoria[];
}

export interface Configuracion {
  id_configuracion: string;
  color: string;
  curva: string;
  diametro: number;
  medida_info: {
    medida: string;
    descripcion: string;
  };
}

export type Visibilidad = "mostrar" | "ocultar" | null;

export const ProductoService = {
  listar: async () => {
    return axiosInstance.get("/api/productos/");
  },

  crear: async (producto: Partial<Producto>) => {
    const data = {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      id_categoria: producto.id_categoria,
      id_configuracion: producto.id_configuracion || null,
    };
    return axiosInstance.post("/api/productos/", data);
  },

  eliminar: async (id: string) => {
    return axiosInstance.delete(`/api/productos/${id}/`);
  },

  obtener: async (id: string) => {
    return axiosInstance.get(`/api/productos/${id}/`);
  },

  actualizar: async (id: string, data: Partial<Producto>) => {
    return axiosInstance.put(`/api/productos/${id}/`, data);
  },

  cambiarEstado: async (id: string, estado: "ACTIVO" | "INACTIVO", motivo?: string) => {
    return axiosInstance.patch(`/api/productos/${id}/cambiar-estado/`, { estado_producto: estado, motivo });
  },

  ajustarStock: async (id: string, tipo: "INCREMENTO" | "DECREMENTO" | "CORRECCION", cantidad: number, motivo: string) => {
    return axiosInstance.post(`/api/productos/${id}/ajustar-stock/`, {
      tipo_ajuste: tipo,
      cantidad,
      motivo,
    });
  },

  listarConImagen: async (params?: { search?: string; categoria?: string; page?: number }) => {
    const response = await axiosInstance.get("/api/productos/productos-imagen/", { params });
    return response.data; // Aquí devolvemos toda la paginación: { count, next, previous, results }
  },
};
