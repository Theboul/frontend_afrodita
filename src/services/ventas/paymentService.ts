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

export interface StripeCreateIntentBody {
  id_venta: number;
  monto: number;
  descripcion?: string;
}

export interface StripeCreateIntentResponse {
  reference: string; // PaymentIntent id (pi_...)
  client_secret: string;
  status: string;
  method: string;
  method_id?: number | null;
  order_total?: string;
  paid_total?: string;
  remaining?: string;
}

export interface StripeSimpleIntentResponse {
  clientSecret: string;
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

  async stripeCreateIntent(body: StripeCreateIntentBody): Promise<APIResponse<StripeCreateIntentResponse>> {
    const response = await axiosInstance.post(`${this.baseURL}/stripe/create-intent/`, body);
    return response as unknown as APIResponse<StripeCreateIntentResponse>;
  }

  // Compat con tu view function create_payment_intent (amount en centavos)
  async createPaymentIntentSimple(amountCents: number, currency: string = 'usd'): Promise<StripeSimpleIntentResponse> {
    // 1) Intentar endpoint dedicado si existe
    try {
      const r1 = await axiosInstance.post(`${this.baseURL}/create-payment-intent/`, { amount: amountCents, currency });
      // Puede venir normalizado o sin normalizar
      const body: any = r1 as any;
      return ('data' in body && body.data?.clientSecret)
        ? { clientSecret: body.data.clientSecret }
        : { clientSecret: (body?.clientSecret || body?.data?.client_secret) };
    } catch (e: any) {
      // 2) Fallback al endpoint /stripe/create-intent/ con el mismo body
      const r2 = await axiosInstance.post(`${this.baseURL}/stripe/create-intent/`, { amount: amountCents / 100, currency });
      const body: any = r2 as any;
      // Este endpoint devuelve client_secret dentro de data
      const cs = body?.data?.client_secret || body?.client_secret || '';
      if (!cs) throw new Error('No se recibió client_secret');
      return { clientSecret: cs };
    }
  }
}

export const paymentService = new PaymentService();
