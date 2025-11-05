import { axiosInstance } from '../axiosConfig';

// Tipos de la API de ventas
export interface MetodoPago {
  id_metodo_pago: number;
  tipo: string;
  categoria: string;
  requiere_pasarela: boolean;
}

export interface IniciarPagoBody {
  id_venta: number;
  monto: number;
  moneda: 'BOB' | 'USD';
  id_metodo_pago?: number;
  metodo?: string; // Ej: 'QR_FISICO'
  descripcion?: string;
  referencia?: string;
}

export interface IniciarPagoResponse {
  reference: string;
  method: string;
  method_id: number;
  status: 'PENDIENTE' | 'COMPLETADO' | string;
  token: string;
  expires_at: number;
  order_total?: string;
  paid_total?: string;
  remaining?: string;
  qr?: { payload: string; hint?: string };
}

export interface EstadoPagoResponse {
  reference: string;
  status: string;
  method_id: number;
  amount?: string;
  description?: string;
  processed_by?: number;
  date?: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface ResumenVenta {
  order_id: number;
  order_total: string;
  paid_total: string;
  remaining: string;
  status: string;
  transactions: Array<{
    id_transaccion: number;
    estado_transaccion: string;
    id_metodo_pago: number;
    referencia_externa: string;
    amount: string;
    date?: string;
  }>;
}

class PaymentService {
  private baseURL = '/api/ventas';

  async getMetodosPago(): Promise<APIResponse<{ methods: MetodoPago[] }>> {
    const response = await axiosInstance.get(`${this.baseURL}/metodos-pago/`);
    // El interceptor ya devuelve { success, message, data }
    return response as unknown as APIResponse<{ methods: MetodoPago[] }>;
  }

  async iniciarPago(body: IniciarPagoBody): Promise<APIResponse<IniciarPagoResponse>> {
    const response = await axiosInstance.post(`${this.baseURL}/iniciar-pago/`, body);
    return response as unknown as APIResponse<IniciarPagoResponse>;
  }

  async confirmarPago(token: string): Promise<APIResponse<{ reference: string; status: string; method?: string; method_id?: number }>> {
    const response = await axiosInstance.post(`${this.baseURL}/confirmar-pago/`, { token });
    return response as unknown as APIResponse<{ reference: string; status: string; method?: string; method_id?: number }>;
  }

  async estadoPago(reference: string): Promise<APIResponse<EstadoPagoResponse>> {
    const response = await axiosInstance.get(`${this.baseURL}/pagos/${encodeURIComponent(reference)}/`);
    return response as unknown as APIResponse<EstadoPagoResponse>;
  }

  async resumenVenta(idVenta: number): Promise<APIResponse<ResumenVenta>> {
    const response = await axiosInstance.get(`${this.baseURL}/venta/${idVenta}/resumen/`);
    return response as unknown as APIResponse<ResumenVenta>;
  }
}

export const paymentService = new PaymentService();
