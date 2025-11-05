// services/cliente/soporteClienteService.ts
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

export interface CrearTicketData {
  asunto: string;
  tipo_consulta: string;
  mensaje: string;
  prioridad?: string;
}

export interface ResponderTicketData {
  mensaje: string;
}

// ==================== SERVICIO ====================
export const soporteClienteService = {
  /**
   * Listar todos los tickets del cliente autenticado
   * GET /api/soporte/tickets/mis-tickets/
   */
  async listarMisTickets(filtros?: {
    estado?: string;
    tipo?: string;
    search?: string;
  }) {
    const response = await axiosInstance.get("/api/soporte/tickets/mis-tickets/", {
      params: filtros,
    });
    return response;
  },

  /**
   * Obtener detalle completo de un ticket del cliente
   * GET /api/soporte/tickets/{id}/mi-ticket/
   */
  async obtenerMiTicket(id: number) {
    const response = await axiosInstance.get(`/api/soporte/tickets/${id}/mi-ticket/`);
    return response;
  },

  /**
   * Crear un nuevo ticket de soporte
   * POST /api/soporte/tickets/
   */
  async crearTicket(data: CrearTicketData) {
    const response = await axiosInstance.post("/api/soporte/tickets/", data);
    return response;
  },

  /**
   * Responder a un ticket existente (como cliente)
   * POST /api/soporte/tickets/{id}/mensaje-cliente/
   */
  async responderTicket(id: number, data: ResponderTicketData) {
    const response = await axiosInstance.post(
      `/api/soporte/tickets/${id}/mensaje-cliente/`,
      data
    );
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
   * Obtener estadísticas de tickets del cliente
   * (calculadas en el frontend)
   */
  calcularEstadisticas(tickets: Ticket[]) {
    return {
      total: tickets.length,
      abiertos: tickets.filter((t) => t.estado !== "CERRADO").length,
      cerrados: tickets.filter((t) => t.estado === "CERRADO").length,
      pendientes: tickets.filter((t) => t.estado === "PENDIENTE").length,
      en_proceso: tickets.filter((t) => t.estado === "EN_PROCESO").length,
      respondidos: tickets.filter((t) => t.estado === "RESPONDIDO").length,
    };
  },
};
