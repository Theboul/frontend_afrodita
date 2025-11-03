import { axiosInstance, type ApiResponse } from '../axiosConfig';

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  nombre_usuario: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'VENDEDOR' | 'CLIENTE';
  estado_usuario: 'ACTIVO' | 'INACTIVO';
  telefono?: string;
  sexo?: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  fecha_registro: string;
  ultimo_login?: string;
  fecha_contrato?: string;
  tipo_vendedor?: 'TIENDA' | 'ONLINE';
}

export interface UsuarioCreate {
  nombre_completo: string;
  nombre_usuario: string;
  correo: string;
  contraseña: string;
  rol: string;
  telefono?: string;
  sexo?: string;
  fecha_contrato?: string;
  tipo_vendedor?: string;
}

export interface FiltrosUsuarios {
  search?: string;
  rol?: string;
  estado?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginacionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Usuario[];
}

export class UsuarioService {
  static async listar(filtros?: FiltrosUsuarios): Promise<ApiResponse<PaginacionResponse>> {
    return axiosInstance.get(
      '/api/usuarios/admin/usuarios/', 
      { params: filtros }
    );
  }

  static async obtener(id: number): Promise<ApiResponse<Usuario>> {
    return axiosInstance.get(
      `/api/usuarios/admin/usuarios/${id}/`
    );
  }

  static async crear(usuario: UsuarioCreate): Promise<ApiResponse<Usuario>> {
    return axiosInstance.post(
      '/api/usuarios/admin/usuarios/', 
      usuario
    );
  }

  static async actualizar(id: number, usuario: Partial<UsuarioCreate>): Promise<ApiResponse<Usuario>> {
    return axiosInstance.patch(
      `/api/usuarios/admin/usuarios/${id}/`, 
      usuario
    );
  }

  static async eliminar(id: number): Promise<ApiResponse<null>> {
    return axiosInstance.delete(
      `/api/usuarios/admin/usuarios/${id}/`
    );
  }

  static async cambiarEstado(
    id: number,
    estado: string,
    motivo?: string
  ): Promise<ApiResponse<Usuario>> {
    return axiosInstance.patch(
      `/api/usuarios/admin/usuarios/${id}/cambiar_estado/`, 
      { estado_usuario: estado, motivo }
    );
  }

  static async cambiarContrasena(id: number, nuevaContrasena: string): Promise<ApiResponse<null>> {
    return axiosInstance.patch(
      `/api/usuarios/admin/usuarios/${id}/cambiar_contrasena/`, 
      { nueva_contrasena: nuevaContrasena }
    );
  }

  static async verificarUsername(params: { username: string; usuario_id?: number }) {
    return axiosInstance.get(
      '/api/usuarios/admin/usuarios/verificar_username/',
      { params }
    );
  }

  static async verificarEmail(params: { email: string; usuario_id?: number }) {
    return axiosInstance.get(
      '/api/usuarios/admin/usuarios/verificar_email/',
      { params }
    );
  }
}
