// services/comprasService.ts
import { axiosInstance } from './../axiosConfig';

export interface Producto {
  id_producto: string;
  nombre: string;
  stock: number;
}

export interface Proveedor {
  cod_proveedor: string;
  nombre: string;
}

export interface DetalleCompra {
  id_producto: string;
  cantidad: number;
  precio: number;
  sub_total: number;
}

export interface Compra {
  id_compra: number;
  fecha: string;
  monto_total: number;
  estado_compra: string;
  cod_proveedor: string;
  items: DetalleCompra[];
}

export interface NuevaCompra {
  cod_proveedor: string;
  fecha: string;
  items: Array<{
    id_producto: string;
    cantidad: number;
    precio: number;
  }>;
}

export const comprasService = {
  // Compras
  async obtenerCompras(): Promise<Compra[]> {
    const response = await axiosInstance.get('/api/compras/ordenes/');
    console.log('Respuesta de obtenerCompras:', response.data);
    const d = response.data;
    // Soporta múltiples formas comunes: {resultados}, {results}, {data:{resultados|results}}, array plano
    const lista =
      (Array.isArray(d) && d) ||
      d?.resultados ||
      d?.results ||
      d?.data?.resultados ||
      d?.data?.results ||
      (Array.isArray(d?.data) ? d.data : []);
    return (lista as Compra[]) || [];
  },

  async crearCompra(compra: NuevaCompra): Promise<any> {
    const response = await axiosInstance.post('/api/compras/ordenes/', compra);
    return response.data;
  },

  async registrarRecepcion(idCompra: number): Promise<any> {
    const response = await axiosInstance.post(
      `/api/compras/ordenes/${idCompra}/registrar-recepcion/`, 
      {}
    );
    return response.data;
  },

  // Proveedores
  async obtenerProveedores(): Promise<Proveedor[]> {
    const response = await axiosInstance.get('/api/proveedores/');
    const d = response.data;
    const lista =
      (Array.isArray(d) && d) ||
      d?.resultados ||
      d?.results ||
      d?.data?.resultados ||
      d?.data?.results ||
      (Array.isArray(d?.data) ? d.data : []);
    return (lista as Proveedor[]) || [];
  },

  // Productos
  async obtenerProductos(): Promise<Producto[]> {
    const response = await axiosInstance.get('/api/productos/');
    const d = response.data;
    const lista =
      (Array.isArray(d) && d) ||
      d?.resultados ||
      d?.results ||
      d?.data?.resultados ||
      d?.data?.results ||
      (Array.isArray(d?.data) ? d.data : []);
    return (lista as Producto[]) || [];
  }
};
