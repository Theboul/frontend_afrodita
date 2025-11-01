import { axiosInstance } from '../axiosConfig';
import type { AxiosResponse } from 'axios';

// ==================== TIPOS ====================
export interface Permiso {
  id_permiso: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  modulo: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion?: string;
  es_sistema: boolean;
  activo: boolean;
  cantidad_permisos: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface RolDetalle extends Rol {
  permisos: Permiso[];
}

export interface UsuarioPermiso {
  id: number;
  usuario: number;
  usuario_nombre: string;
  permiso: number;
  permiso_nombre: string;
  permiso_codigo: string;
  concedido: boolean;
  tipo_permiso: 'CONCEDIDO' | 'REVOCADO';
  fecha_expiracion?: string;
  motivo?: string;
  otorgado_por?: number;
  otorgado_por_nombre?: string;
  fecha_otorgado: string;
  activo: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ==================== SERVICIO ====================
class SeguridadService {
  private baseURL = '/api/seguridad';

  // ========== PERMISOS ==========
  async obtenerPermisos(params?: {
    modulo?: string;
    activo?: boolean;
    search?: string;
  }): Promise<APIResponse<Permiso[]>> {
    try {
      const response: AxiosResponse<PaginatedResponse<Permiso> | APIResponse<Permiso[]>> = await axiosInstance.get(
        `${this.baseURL}/permisos/`,
        { params }
      );
      
      // Verificar si es respuesta paginada
      if ('results' in response.data) {
        return {
          success: true,
          message: `${response.data.count} permisos encontrados`,
          data: response.data.results
        };
      }
      
      // Si ya viene en formato APIResponse
      return response.data as APIResponse<Permiso[]>;
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      throw error;
    }
  }

  async obtenerPermisosPorModulo(): Promise<APIResponse<Record<string, Permiso[]>>> {
    const response = await axiosInstance.get(`${this.baseURL}/permisos/por-modulo/`);
    return response.data;
  }

  async obtenerPermiso(id: number): Promise<APIResponse<Permiso>> {
    const response = await axiosInstance.get(`${this.baseURL}/permisos/${id}/`);
    return response.data;
  }

  async crearPermiso(data: {
    nombre: string;
    codigo: string;
    descripcion?: string;
    modulo: string;
    activo?: boolean;
  }): Promise<APIResponse<Permiso>> {
    const response = await axiosInstance.post(`${this.baseURL}/permisos/`, data);
    return response.data;
  }

  async actualizarPermiso(id: number, data: Partial<Permiso>): Promise<APIResponse<Permiso>> {
    const response = await axiosInstance.patch(`${this.baseURL}/permisos/${id}/`, data);
    return response.data;
  }

  async eliminarPermiso(id: number): Promise<APIResponse<null>> {
    const response = await axiosInstance.delete(`${this.baseURL}/permisos/${id}/`);
    return response.data;
  }

  // ========== ROLES ==========
  async obtenerRoles(params?: {
    activo?: boolean;
    es_sistema?: boolean;
    search?: string;
  }): Promise<APIResponse<Rol[]>> {
    const response: AxiosResponse<PaginatedResponse<Rol>> = await axiosInstance.get(
      `${this.baseURL}/roles/`,
      { params }
    );
    
    // Convertir respuesta paginada a formato APIResponse
    return {
      success: true,
      message: `${response.data.count} roles encontrados`,
      data: response.data.results
    };
  }

  async obtenerRol(id: number): Promise<APIResponse<RolDetalle>> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/roles/${id}/`);
      
      // Verificar si ya viene en formato APIResponse
      if (response.data && 'success' in response.data) {
        return response.data;
      }
      
      // Si viene directamente el objeto rol
      if (response.data && 'id_rol' in response.data) {
        return {
          success: true,
          message: "Rol obtenido exitosamente",
          data: response.data
        };
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async crearRol(data: {
    nombre: string;
    descripcion?: string;
    permisos_ids?: number[];
    activo?: boolean;
  }): Promise<APIResponse<RolDetalle>> {
    try {
      const response = await axiosInstance.post(`${this.baseURL}/roles/`, data);
      
      // Si ya viene en formato APIResponse
      if (response.data && 'success' in response.data) {
        return response.data;
      }
      
      // Si viene directamente el objeto creado
      if (response.data && 'id_rol' in response.data) {
        return {
          success: true,
          message: "Rol creado exitosamente",
          data: response.data
        };
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async actualizarRol(id: number, data: Partial<RolDetalle>): Promise<APIResponse<RolDetalle>> {
    try {
      const response = await axiosInstance.patch(`${this.baseURL}/roles/${id}/`, data);
      
      // Si ya viene en formato APIResponse
      if (response.data && 'success' in response.data) {
        return response.data;
      }
      
      // Si viene directamente el objeto actualizado
      if (response.data && 'id_rol' in response.data) {
        return {
          success: true,
          message: "Rol actualizado exitosamente",
          data: response.data
        };
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async eliminarRol(id: number): Promise<APIResponse<null>> {
    try {
      const response = await axiosInstance.delete(`${this.baseURL}/roles/${id}/`);
      
      // Si ya viene en formato APIResponse
      if (response.data && 'success' in response.data) {
        return response.data;
      }
      
      // Si la eliminación fue exitosa (status 204 o 200)
      if (response.status === 204 || response.status === 200) {
        return {
          success: true,
          message: "Rol eliminado exitosamente",
          data: null
        };
      }
      
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async asignarPermisosARol(
    rolId: number,
    permisosIds: number[]
  ): Promise<APIResponse<{ permisos_asignados: string[] }>> {
    const response = await axiosInstance.post(
      `${this.baseURL}/roles/${rolId}/asignar-permisos/`,
      { permisos_ids: permisosIds }
    );
    return response.data;
  }

  async removerPermisoDeRol(rolId: number, permisoId: number): Promise<APIResponse<null>> {
    const response = await axiosInstance.delete(
      `${this.baseURL}/roles/${rolId}/remover-permiso/${permisoId}/`
    );
    return response.data;
  }

  async obtenerUsuariosConRol(rolId: number): Promise<APIResponse<any[]>> {
    try {
      const response = await axiosInstance.get(`${this.baseURL}/roles/${rolId}/usuarios/`);
      
      // Verificar si viene con la clave 'usuarios' (formato del backend)
      if (response.data && 'usuarios' in response.data) {
        return {
          success: true,
          message: response.data.message || `${response.data.total || 0} usuarios encontrados`,
          data: response.data.usuarios
        };
      }
      
      // Verificar si es respuesta paginada
      if (response.data && 'results' in response.data) {
        return {
          success: true,
          message: `${response.data.count || 0} usuarios encontrados`,
          data: response.data.results
        };
      }
      
      // Si ya viene en formato APIResponse con 'data'
      if (response.data && 'success' in response.data && 'data' in response.data) {
        return response.data;
      }
      
      // Si es un array directo
      if (Array.isArray(response.data)) {
        return {
          success: true,
          message: `${response.data.length} usuarios encontrados`,
          data: response.data
        };
      }
      
      return response.data;
    } catch (error: any) {
      // Si el endpoint no existe o hay error 500, devolver array vacío
      if (error.response?.status === 500 || error.response?.status === 404) {
        return {
          success: true,
          message: "Endpoint no disponible",
          data: []
        };
      }
      
      throw error;
    }
  }

  // ========== PERMISOS INDIVIDUALES ==========
  async obtenerPermisosIndividuales(params?: {
    usuario?: number;
    tipo?: 'concedido' | 'revocado';
    activos?: boolean;
  }): Promise<APIResponse<UsuarioPermiso[]>> {
    const response = await axiosInstance.get(`${this.baseURL}/usuario-permisos/`, { params });
    return response.data;
  }

  async concederRevocarPermiso(data: {
    usuario: number;
    permiso: number;
    concedido: boolean;
    fecha_expiracion?: string;
    motivo: string;
  }): Promise<APIResponse<UsuarioPermiso>> {
    const response = await axiosInstance.post(`${this.baseURL}/usuario-permisos/`, data);
    return response.data;
  }

  async eliminarPermisoIndividual(id: number): Promise<APIResponse<null>> {
    const response = await axiosInstance.delete(`${this.baseURL}/usuario-permisos/${id}/`);
    return response.data;
  }

  async obtenerPermisosDeUsuario(usuarioId: number): Promise<APIResponse<any>> {
    const response = await axiosInstance.get(
      `${this.baseURL}/usuario-permisos/usuario/${usuarioId}/`
    );
    return response.data;
  }

  async obtenerPermisosEfectivos(usuarioId: number): Promise<APIResponse<any>> {
    const response = await axiosInstance.get(
      `${this.baseURL}/usuario-permisos/efectivos/${usuarioId}/`
    );
    return response.data;
  }
}

export const seguridadService = new SeguridadService();