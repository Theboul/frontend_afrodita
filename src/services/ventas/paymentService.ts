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

class PaymentService {
  private baseURL = '/api/ventas';

  async getMetodosPago(): Promise<APIResponse<{ methods: MetodoPago[] }>> {
    const response = await axiosInstance.get(`${this.baseURL}/metodos-pago/`);
    return response.data;
  }

  async iniciarPago(body: IniciarPagoBody): Promise<APIResponse<IniciarPagoResponse>> {
    const response = await axiosInstance.post(`${this.baseURL}/iniciar-pago/`, body);
    return response.data;
  }

  async confirmarPago(token: string): Promise<APIResponse<{ reference: string; status: string; method?: string; method_id?: number }>> {
    const response = await axiosInstance.post(`${this.baseURL}/confirmar-pago/`, { token });
    return response.data;
  }

  async estadoPago(reference: string): Promise<APIResponse<EstadoPagoResponse>> {
    const response = await axiosInstance.get(`${this.baseURL}/pagos/${encodeURIComponent(reference)}/`);
    return response.data;
  }
}

export const paymentService = new PaymentService();

