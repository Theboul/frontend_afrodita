import axios from "axios";

const API_URL = "http://localhost:8000/api/usuarios/";

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  nombre_usuario: string;
  correo: string;
  telefono: string;
  sexo: string;
  rol: string;
  password?: string;
  estado_usuario?: string;

  // solo si rol es VENDEDOR o ADMIN
  fecha_contrato?: string;
  tipo_vendedor?: string; 
}


export const UsuarioService = {
  listar: () => axios.get<Usuario[]>(API_URL),

  crear: (data: Partial<Usuario>) =>
    axios.post(API_URL, data, { withCredentials: true }),

  actualizar: (id: number, data: Partial<Usuario>) =>
    axios.put(`${API_URL}${id}/`, data, { withCredentials: true }),

  eliminar: (id: number) =>
    axios.delete(`${API_URL}${id}/`, { withCredentials: true }),

  bloquear: (id: number, estado: string) =>
    axios.patch(
      `${API_URL}${id}/`,
      { estado_usuario: estado },
      { withCredentials: true }
    ),
};
