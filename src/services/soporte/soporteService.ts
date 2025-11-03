// services/soporteService.ts
import { axiosInstance } from "../axiosConfig";

// ==================== TIPOS ====================
export interface Mensaje {
  id_mensaje: number;
  id_usuario: number;
  usuario_nombre: string;
  mensaje: string;
  fecha_envio: string;
  es_respuesta_agente: boolean;
  tipo_mensaje: string;
}

export interface Ticket {
  id_ticket: number;
  asunto: string;
  tipo_consulta: string;
  estado: string;
  fecha_creacion: string;
  cliente_nombre: string;
  agente_nombre: string | null;
  cantidad_mensajes: number;
}

export interface TicketDetalle extends Ticket {
  mensaje: string;
  fecha_modificacion: string;
  tipo_display: string;
  estado_display: string;
  puede_responder: boolean;
  mensajes: Mensaje[];
}

export interface ListarTicketsParams {
  page?: number;
  page_size?: number;
  estado?: string;
  tipo?: string;
  search?: string;
  cliente_id?: number;
}

// ==================== SERVICIO ====================
export const soporteService = {
  /**
   * Listar todos los tickets (admin)
   * GET /api/soporte/tickets/
   */
  async listarTickets(params?: ListarTicketsParams) {
    const response = await axiosInstance.get("/api/soporte/tickets/", { params });
    return response;
  },

  /**
   * Obtener detalle de un ticket específico
   * GET /api/soporte/tickets/{id}/
   */
  async obtenerTicket(id: number) {
    const response = await axiosInstance.get(`/api/soporte/tickets/${id}/`);
    return response;
  },

  /**
   * Responder a un ticket (agente)
   * POST /api/soporte/tickets/{id}/responder/
   */
  async responderTicket(id: number, data: { mensaje: string }) {
    const response = await axiosInstance.post(`/api/soporte/tickets/${id}/responder/`, data);
    return response;
  },

  /**
   * Cerrar un ticket
   * POST /api/soporte/tickets/{id}/cerrar/
   */
  async cerrarTicket(id: number) {
    const response = await axiosInstance.post(`/api/soporte/tickets/${id}/cerrar/`);
    return response;
  },

  /**
   * Reabrir un ticket cerrado
   * POST /api/soporte/tickets/{id}/reabrir/
   */
  async reabrirTicket(id: number) {
    const response = await axiosInstance.post(`/api/soporte/tickets/${id}/reabrir/`);
    return response;
  },

  /**
   * Asignar un ticket a un agente
   * POST /api/soporte/tickets/{id}/asignar/
   */
  async asignarTicket(id: number, data: { id_agente: number }) {
    const response = await axiosInstance.post(`/api/soporte/tickets/${id}/asignar/`, data);
    return response;
  },
};
