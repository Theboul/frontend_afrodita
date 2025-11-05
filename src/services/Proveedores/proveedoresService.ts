// services/proveedoresService.ts
import { axiosInstance } from '../axiosConfig';

export interface Proveedor {
  cod_proveedor: string;
  nombre: string;
  contacto: string;
  telefono: string | null;
  direccion: string | null;
  pais: string | null;
  estado_proveedor: string;
}

export interface CrearProveedor {
  cod_proveedor: string;
  nombre: string;
  contacto: string;
  telefono?: string;
  direccion?: string;
  pais?: string;
  estado_proveedor?: string;
}

export interface ActualizarProveedor {
  nombre?: string;
  contacto?: string;
  telefono?: string;
  direccion?: string;
  pais?: string;
}

export const proveedoresService = {
  // Obtener todos los proveedores
  async obtenerProveedores(): Promise<Proveedor[]> {
    const response = await axiosInstance.get('/api/proveedores/');
    console.log('Respuesta de obtenerProveedores:', response.data);
    const d: any = response.data;
    const lista =
      (Array.isArray(d) && d) ||
      d?.resultados ||
      d?.results ||
      d?.data?.resultados ||
      d?.data?.results ||
      (Array.isArray(d?.data) ? d.data : d?.data?.proveedores) ||
      [];
    return (lista as Proveedor[]) || [];
  },

  // Obtener un proveedor por código
  async obtenerProveedor(codProveedor: string): Promise<Proveedor> {
    const response = await axiosInstance.get(`/api/proveedores/${codProveedor}/`);
    const d: any = response.data;
    return (d?.data?.proveedor || d?.proveedor || d?.data || d) as Proveedor;
  },

  // Crear nuevo proveedor
  async crearProveedor(proveedor: CrearProveedor): Promise<any> {
    const response = await axiosInstance.post('/api/proveedores/', proveedor);
    return response.data;
  },

  // Actualizar proveedor
  async actualizarProveedor(codProveedor: string, datos: ActualizarProveedor): Promise<any> {
    const response = await axiosInstance.patch(`/api/proveedores/${codProveedor}/`, datos);
    return response.data;
  },

  // Bloquear proveedor
  async bloquearProveedor(codProveedor: string): Promise<any> {
    const response = await axiosInstance.post(`/api/proveedores/${codProveedor}/bloquear/`);
    return response.data;
  },

  // Activar proveedor
  async activarProveedor(codProveedor: string): Promise<any> {
    const response = await axiosInstance.post(`/api/proveedores/${codProveedor}/activar/`);
    return response.data;
  },

  // Eliminar proveedor (si está implementado en el backend)
  async eliminarProveedor(codProveedor: string): Promise<any> {
    const response = await axiosInstance.delete(`/api/proveedores/${codProveedor}/`);
    return response.data;
  }
};
