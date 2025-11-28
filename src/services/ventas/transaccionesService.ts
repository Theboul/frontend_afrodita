import { axiosInstance } from "../axiosConfig";

export interface TransaccionVenta {
  id_transaccion: number;
  id_venta: number;
  id_metodo_pago: number | null;
  monto: number;
  fecha_transaccion: string;
  estado_transaccion: string;
  referencia_externa?: string;
  descripcion?: string;
  codigo_error?: string;
  procesado_por?: number | string | null;
  observacion?: string;
}

export interface TransaccionesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TransaccionVenta[];
}

export interface ListParams {
  page?: number;
  page_size?: number;
}

export const transaccionesService = {
  async list(params: ListParams = {}): Promise<TransaccionesResponse> {
    const res = await axiosInstance.get("/ventas/transacciones/", { params });
    // El backend DRF devuelve la paginación estándar { count, next, previous, results }
    return (res as any).data ?? res;
  },
};
