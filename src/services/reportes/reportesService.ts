import { axiosInstance, type ApiResponse } from "../axiosConfig";

export type TipoReporte =
  | "VENTAS"
  | "CLIENTES"
  | "ENVIOS"
  | "PRODUCTOS_MAS_VENDIDOS"
  | "INVENTARIO"
  | "PROMOCIONES"
  | "BITACORA";

export type FrecuenciaReporte = "DIARIO" | "MENSUAL" | "ANUAL";

export interface ReporteTipo {
  codigo: TipoReporte;
  nombre: string;
  descripcion: string;
  soporta_exportacion: boolean;
}

export interface GenerarReportePayload {
  tipo_reporte: TipoReporte;
  fecha_desde?: string;
  fecha_hasta?: string;
  frecuencia?: FrecuenciaReporte;
  id_metodo_pago?: number;
  cliente?: string;
  top?: number;
  estado_envio?: string;
  solo_stock_bajo?: boolean;
  estado_promocion?: "ACTIVAS" | "EXPIRADAS" | "TODAS";
  accion?: string;
  usuario_id?: number;
  formato?: "JSON" | "EXCEL" | "PDF";
}

export interface ReporteGenerado {
  tipo_reporte: TipoReporte;
  filtros: Record<string, unknown>;
  resumen: Record<string, unknown>;
  resultados: Array<Record<string, unknown>>;
}

export interface AccionBitacora {
  codigo: string;
  descripcion: string;
}

export interface UsuarioReporteResumen {
  id_usuario: number;
  nombre_usuario: string;
  nombre_completo: string;
  correo: string;
}

export const reportesService = {
  async getTipos(): Promise<ApiResponse<{ tipos: ReporteTipo[] }>> {
    const response = await axiosInstance.get("/api/reportes/tipos/");
    return response as ApiResponse<{ tipos: ReporteTipo[] }>;
  },

  async generar(
    payload: GenerarReportePayload
  ): Promise<ApiResponse<ReporteGenerado>> {
    const response = await axiosInstance.post(
      "/api/reportes/generar/",
      payload
    );
    return response as ApiResponse<ReporteGenerado>;
  },

  async getAccionesBitacora(): Promise<ApiResponse<{ acciones: AccionBitacora[] }>> {
    const response = await axiosInstance.get("/api/reportes/bitacora/acciones/");
    return response as ApiResponse<{ acciones: AccionBitacora[] }>;
  },

  async buscarUsuarios(q: string): Promise<{ results: UsuarioReporteResumen[] }> {
    const response = await axiosInstance.get("/api/reportes/usuarios/buscar/", {
      params: { q, limit: 10 },
    });
    return (response as any).data as { results: UsuarioReporteResumen[] };
  },
};
