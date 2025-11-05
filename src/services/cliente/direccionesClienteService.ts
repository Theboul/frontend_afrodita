// services/cliente/direccionesClienteService.ts
import { axiosInstance } from "../axiosConfig";

// ==================== TIPOS ====================
export interface Direccion {
  id_direccion: number;
  etiqueta: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  pais: string;
  referencia?: string;
  es_principal: boolean;
  guardada: boolean;
  fecha_creacion?: string;
}

export interface CrearDireccionData {
  etiqueta?: string;
  direccion: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  referencia?: string;
  es_principal?: boolean;
  guardada?: boolean;
}

export interface ActualizarDireccionData {
  etiqueta?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  referencia?: string;
  es_principal?: boolean;
}

// ==================== SERVICIO ====================
export const direccionesClienteService = {
  /**
   * Listar todas las direcciones guardadas del cliente autenticado
   * GET /api/usuarios/perfil/direcciones/
   */
  async listarMisDirecciones() {
    const response = await axiosInstance.get("/api/usuarios/perfil/direcciones/");
    return response;
  },

  /**
   * Obtener detalle de una dirección específica
   * GET /api/usuarios/perfil/direcciones/{id}/
   */
  async obtenerDireccion(id: number) {
    const response = await axiosInstance.get(`/api/usuarios/perfil/direcciones/${id}/`);
    return response;
  },

  /**
   * Crear una nueva dirección
   * POST /api/usuarios/perfil/direcciones/
   */
  async crearDireccion(data: CrearDireccionData) {
    const response = await axiosInstance.post("/api/usuarios/perfil/direcciones/", data);
    return response;
  },

  /**
   * Actualizar una dirección existente
   * PATCH /api/usuarios/perfil/direcciones/{id}/
   */
  async actualizarDireccion(id: number, data: ActualizarDireccionData) {
    const response = await axiosInstance.patch(
      `/api/usuarios/perfil/direcciones/${id}/`,
      data
    );
    return response;
  },

  /**
   * Eliminar una dirección (soft delete)
   * DELETE /api/usuarios/perfil/direcciones/{id}/
   */
  async eliminarDireccion(id: number) {
    const response = await axiosInstance.delete(`/api/usuarios/perfil/direcciones/${id}/`);
    return response;
  },

  /**
   * Marcar una dirección como principal
   * POST /api/usuarios/perfil/direcciones/{id}/marcar-principal/
   */
  async marcarPrincipal(id: number) {
    const response = await axiosInstance.post(
      `/api/usuarios/perfil/direcciones/${id}/marcar-principal/`
    );
    return response;
  },

  /**
   * Obtener la dirección principal del cliente
   * (filtrado en el frontend)
   */
  obtenerDireccionPrincipal(direcciones: Direccion[]): Direccion | null {
    return direcciones.find((d) => d.es_principal) || null;
  },

  /**
   * Validar si el cliente tiene al menos una dirección
   */
  tieneDirecciones(direcciones: Direccion[]): boolean {
    return direcciones.length > 0;
  },

  /**
   * Obtener estadísticas de direcciones
   */
  calcularEstadisticas(direcciones: Direccion[]) {
    return {
      total: direcciones.length,
      principal: direcciones.find((d) => d.es_principal) ? 1 : 0,
      alternativas: direcciones.filter((d) => !d.es_principal).length,
    };
  },
};
