import { axiosInstance } from '../axiosConfig';

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
  // Campos específicos por rol
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
  static async listar(filtros?: FiltrosUsuarios): Promise<{ data: PaginacionResponse }> {
    const response = await axiosInstance.get('/api/usuarios/admin/usuarios/', { 
      params: filtros 
    });
    return response;
  }

  static async obtener(id: number): Promise<{ data: Usuario }> {
    const response = await axiosInstance.get(`/api/usuarios/admin/usuarios/${id}/`);
    return response;
  }

  static async crear(usuario: UsuarioCreate): Promise<{ data: Usuario }> {
    const response = await axiosInstance.post('/api/usuarios/admin/usuarios/', usuario);
    return response;
  }

  static async actualizar(id: number, usuario: Partial<UsuarioCreate>): Promise<{ data: Usuario }> {
    const response = await axiosInstance.patch(`/api/usuarios/admin/usuarios/${id}/`, usuario);
    return response;
  }

  static async eliminar(id: number): Promise<void> {
    await axiosInstance.delete(`/api/usuarios/admin/usuarios/${id}/`);
  }

  static async cambiarEstado(id: number, estado: string, motivo?: string): Promise<{ data: Usuario }> {
    const response = await axiosInstance.patch(`/api/usuarios/admin/usuarios/${id}/cambiar_estado/`, { 
      estado_usuario: estado, 
      motivo 
    });
    return response;
  }

  static async cambiarContrasena(id: number, nuevaContrasena: string): Promise<void> {
    await axiosInstance.patch(`/api/usuarios/admin/usuarios/${id}/cambiar_contrasena/`, { 
      nueva_contrasena: nuevaContrasena 
    });
  }

  static async verificarUsername(params: { username: string; usuario_id?: number }) {
    const response = await axiosInstance.get('/api/usuarios/admin/usuarios/verificar_username/', { 
      params 
    });
    return response;
  }

  static async verificarEmail(params: { email: string; usuario_id?: number }) {
    const response = await axiosInstance.get('/api/usuarios/admin/usuarios/verificar_email/', { 
      params 
    });
    return response;
  }
}