import { useState, useCallback } from "react";
import { axiosInstance } from "../services/axiosConfig";

type ConciliacionCode = "OK" | "E1" | "E2" | "E3" | "E4";

export interface ConciliacionRespuesta {
  code: ConciliacionCode;
  message?: string;
  data?: any;
  monto?: number;
  moneda?: string;
  stripe_status?: string;
  referencia?: string;
}

export interface VentaResumen {
  id?: number;
  estado?: string;
  status?: string;
  transacciones?: any[];
  transactions?: any[];
  total?: number;
  currency?: string;
}

const CODE_MESSAGES: Record<ConciliacionCode, string> = {
  OK: "Pago conciliado correctamente.",
  E1: "El monto o la moneda no coincide con la venta.",
  E2: "Transacción o venta no encontrada.",
  E3: "Error consultando Stripe. Inténtalo de nuevo.",
  E4: "Pago pendiente o rechazado en Stripe.",
};

const normalizeCode = (code?: string): ConciliacionCode => {
  if (code === "OK" || code === "E1" || code === "E2" || code === "E3" || code === "E4") {
    return code;
  }
  return "E3";
};

const extractData = (res: any) => {
  if (!res) return {};
  if (res.data?.data) return res.data.data;
  if (res.data) return res.data;
  return res;
};

export function useConciliacionStripe() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<ConciliacionCode | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<ConciliacionRespuesta | null>(null);
  const [resumen, setResumen] = useState<VentaResumen | null>(null);

  const conciliar = useCallback(async (payload: { referencia: string; idVenta: number }) => {
    setLoading(true);
    setMessage(null);
    setCode(null);
    setDetalle(null);
    try {
      const res = await axiosInstance.post("/api/pagos/conciliar/", {
        referencia: payload.referencia,
        id_venta: payload.idVenta,
      });
      const data = extractData(res);
      const transaccion = data?.transaccion;
      const finalCode = normalizeCode(
        data?.code ??
          (data?.success === true ? "OK" : undefined) ??
          (transaccion ? "OK" : undefined)
      );
      setCode(finalCode);
      setMessage(data?.message ?? CODE_MESSAGES[finalCode]);
      setDetalle({
        code: finalCode,
        message: data?.message,
        data: data?.data,
        monto: data?.monto ?? data?.amount ?? transaccion?.monto,
        moneda: data?.moneda ?? data?.currency ?? transaccion?.moneda,
        stripe_status:
          data?.stripe_status ??
          data?.status ??
          transaccion?.estado_transaccion ??
          transaccion?.estado,
        referencia:
          data?.referencia ??
          data?.reference ??
          transaccion?.referencia_externa ??
          payload.referencia,
      });
      return finalCode;
    } catch (err: any) {
      setCode("E3");
      setMessage(err?.message ?? CODE_MESSAGES.E3);
      setDetalle(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarResumen = useCallback(async (idVenta: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/ventas/venta/${idVenta}/resumen/`);
      const data = extractData(res) as VentaResumen;
      setResumen(data);
      return data;
    } catch (err) {
      setResumen(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCode(null);
    setMessage(null);
    setDetalle(null);
    setResumen(null);
  }, []);

  return {
    conciliar,
    cargarResumen,
    reset,
    loading,
    code,
    message,
    detalle,
    resumen,
    codeMessages: CODE_MESSAGES,
  };
}
