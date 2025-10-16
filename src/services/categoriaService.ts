import axios from "axios";

const API_URL = "http://localhost:8000/api/categoria/";

export const CategoriaService = {
  listar: () => axios.get(API_URL, { withCredentials: true }),
  obtener: (id: number) => axios.get(`${API_URL}${id}/`, { withCredentials: true }),
  crear: (data: any) => axios.post(API_URL, data, { withCredentials: true }),
  actualizar: (id: number, data: any) => axios.put(`${API_URL}${id}/`, data, { withCredentials: true }),
  eliminar: (id: number) => axios.delete(`${API_URL}${id}/`, { withCredentials: true }),
};