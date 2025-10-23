import { axiosInstance } from '../axiosConfig';

export interface Bitacora {
  id_bitacora: number;
  fecha_hora: string;
  accion: string;
  accion_display: string;
  descripcion: string;
  ip: string;
  usuario: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
  filtros_aplicados?: Record<string, string>;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BitacoraFilters {
  fecha_desde?: string;
  fecha_hasta?: string;
  accion?: string;
  usuario_id?: string;
  search?: string;
}

export interface EstadisticasBitacora {
  periodo: string;
  total_eventos: number;
  estadisticas_por_accion: Array<{
    accion: string;
    total: number;
  }>;
  usuarios_mas_activos: Array<{
    id_usuario__nombre_usuario: string;
    total: number;
  }>;
  actividad_diaria: Array<{
    fecha: string;
    total: number;
  }>;
  distribucion_usuarios: {
    registrados: number;
    anonimos: number;
    porcentaje_anonimos: number;
  };
  top_ips: Array<{
    ip: string;
    total: number;
  }>;
}

// ==================== SERVICES ====================
export const bitacoraService = {
  // Obtener logs con paginación y filtros
  getBitacoraLogs: async (
    page: number = 1,
    pageSize: number = 50,
    filters: BitacoraFilters = {}
  ): Promise<PaginatedResponse<Bitacora>> => {
    const params = {
      page,
      page_size: pageSize,
      ...filters
    };

    const response = await axiosInstance.get('api/bitacora/logs/', { params });
    return response.data;
  },

  // Obtener estadísticas
  getEstadisticas: async (dias: number = 7): Promise<EstadisticasBitacora> => {
    const response = await axiosInstance.get('api/bitacora/estadisticas/', {
      params: { dias }
    });
    return response.data;
  },

  // Obtener últimos movimientos
  getUltimosMovimientos: async (limite: number = 50): Promise<{
    total: number;
    limite: number;
    eventos: Bitacora[];
  }> => {
    const response = await axiosInstance.get('api/bitacora/ultimos-movimientos/', {
      params: { limite }
    });
    return response.data;
  },

  // Obtener eventos sospechosos
  getEventosSospechosos: async (dias: number = 7, limite: number = 50): Promise<{
    periodo: string;
    resumen: {
      intentos_fallidos: number;
      actividad_sospechosa: number;
      total_eventos_seguridad: number;
    };
    ips_mas_sospechosas: Array<{ ip: string; total: number }>;
    eventos: Bitacora[];
  }> => {
    const response = await axiosInstance.get('api/bitacora/eventos-sospechosos/', {
      params: { dias, limite }
    });
    return response.data;
  },

  // Obtener actividad de usuario específico
  getActividadUsuario: async (usuarioId: number, dias: number = 30, limite: number = 100): Promise<{
    usuario_id: number;
    periodo: string;
    total_eventos: number;
    estadisticas_por_accion: Array<{ accion: string; total: number }>;
    eventos: Bitacora[];
  }> => {
    const response = await axiosInstance.get(`api/bitacora/usuario/${usuarioId}/actividad/`, {
      params: { dias, limite }
    });
    return response.data;
  },

  // Obtener mi actividad
  getMiActividad: async (dias: number = 7, limite: number = 100): Promise<{
    periodo: string;
    total_eventos: number;
    estadisticas_por_accion: Array<{ accion: string; total: number }>;
    eventos: Bitacora[];
  }> => {
    const response = await axiosInstance.get('api/bitacora/mi-actividad/', {
      params: { dias, limite }
    });
    return response.data;
  }
};