// services/CarritoService.ts
import { axiosInstance } from "../../services/axiosConfig";

// ============================
// Tipos (Sin cambios)
// ============================
export interface DetalleCarrito {
  id_producto: string;
  nombre_producto: string;
  cantidad: number | string;
  precio_unitario: number | string;
  precio_total: number | string;
}

export interface CarritoResponse {
  id_carrito: number;
  estado_carrito: string;
  detalles: DetalleCarrito[];
  total_general: number;
}

// ============================
// Servicio principal
// ============================

// CORREGIDO: La ruta base NO debe duplicarse.
// Tu api_root dice que es '/api/carrito/'
const BASE = "/api/carrito"; 

const CarritoService = {
  // Obtener carrito activo
  async obtener(): Promise<CarritoResponse> {
    // La URL final será: /api/carrito/
    const response = await axiosInstance.get(`${BASE}/`);
    return response.data;
  },

  // Agregar producto
  async agregar(
    id_producto: string | number,
    cantidad: number
  ): Promise<CarritoResponse> {
    // La URL final será: /api/carrito/agregar/
    const response = await axiosInstance.post(
      `${BASE}/agregar/`,
      { id_producto, cantidad }
    );
    return response.data;
  },

  // Actualizar cantidad
  async actualizar(
    id_producto: string | number,
    cantidad: number
  ): Promise<CarritoResponse> {
   
    const response = await axiosInstance.put(
      `${BASE}/actualizar/`,
      { id_producto, cantidad }
    );
    return response.data;
  },

  
  async vaciar(): Promise<any> {
   
    const response = await axiosInstance.delete(`${BASE}/vaciar/`);
    return response.data;
  },
};

export default CarritoService;