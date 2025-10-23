import axios from "axios";

const API_URL = "http://localhost:8000/api/productos/productos/";


export interface Producto {
  id_producto: string;     
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado_producto: string;
  categoria: number;
  configuracion: string;
}

export const ProductoService = {
  listar: () => axios.get<Producto[]>(API_URL, { withCredentials: true }),
  obtener: (id: string) => axios.get<Producto>(`${API_URL}${id}/`, { withCredentials: true }),
  crear: (data: Partial<Producto>) => axios.post(API_URL, data, { withCredentials: true }),
  actualizar: (id: string, data: Partial<Producto>) => axios.put(`${API_URL}${id}/`, data, { withCredentials: true }),
  eliminar: (id: string) => axios.delete(`${API_URL}${id}/`, { withCredentials: true }),
};
