// src/services/cliente/ventaClienteService.ts
import { axiosInstance, type ApiResponse } from "../axiosConfig";

// ==================== TIPOS ====================

interface ProductoVenta {
  id_producto: string | number;
  cantidad: number;
}

export interface CrearVentaOnlineData {
  id_direccion: number;
  productos: ProductoVenta[];
}
export interface VentaOnlineResponse {
  client_secret: string;
  reference: string;
  id_venta: number;
  // Otros campos que el backend pueda devolver
}

/**
 * Servicio para gestionar las ventas del lado del cliente.
 */
export const ventaClienteService = {
  /**
   * Crea una nueva venta online a partir del carrito del usuario.
   * El backend debe tomar los productos del carrito asociado al usuario autenticado.
   * @param data - Objeto con el ID de la dirección y la lista de productos.
   */
  async crearVentaOnline(data: CrearVentaOnlineData): Promise<VentaOnlineResponse> {
    // 1. Llamamos a la API. axiosInstance devuelve un objeto ApiResponse.
    //    No usamos el genérico <VentaOnlineResponse> porque no es soportado.
    const response: ApiResponse<VentaOnlineResponse> = await axiosInstance.post("/api/ventas/online/", data);

    // 2. Extraemos los datos de la venta del objeto ApiResponse.
    //    Asumimos que los datos están en la propiedad `data`.
    if (!response.data) {
      // Si la API no devuelve datos, lanzamos un error.
      throw new Error(
        response.message || "La respuesta de la API para crear la venta no contiene los datos esperados."
      );
    }

    return response.data;
  },
};
