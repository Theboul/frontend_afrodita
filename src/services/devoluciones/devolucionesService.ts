import api from "../api";

export interface DetalleDevolucionCompra {
  id_detalle: number;
  devolucion: number;
  producto: string;
  cantidad: number;
  precio_unit: string;
  sub_total: string;
  observacion: string;
}

export interface DevolucionCompra {
  id_devolucion_compra: number;
  compra: number;
  fecha_devolucion: string;
  motivo_general: string;
  monto_total: string;
  estado_devolucion: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  procesado_por: number | null;
  detalles?: DetalleDevolucionCompra[];
}

export interface CrearDevolucionPayload {
  compra: number;
  fecha_devolucion: string;
  motivo_general: string;
  monto_total: number;
}

// 👉 CLIENTE CREA DEVOLUCIÓN
export const crearDevolucion = async (payload: any) => {
  return api.post("/compras/devoluciones/", payload);
};

// Admin aprobar
export const aprobarDevolucion = async (id: number) => {
  return api.patch(`/devoluciones/aprobar/${id}/`);
};

// Admin rechazar
export const rechazarDevolucion = async (id: number) => {
  return api.patch(`/devoluciones/rechazar/${id}/`);
};

const baseUrl = "/api/devoluciones";

export const DevolucionesService = {
  crear(payload: CrearDevolucionPayload) {
    return api.post<DevolucionCompra>(`${baseUrl}/crear/`, payload);
  },

  mis() {
    return api.get<DevolucionCompra[]>(`${baseUrl}/mias/`);
  },

  todas() {
    return api.get<DevolucionCompra[]>(`${baseUrl}/todas/`);
  },

  aprobar(id: number) {
    return api.patch<DevolucionCompra>(`${baseUrl}/${id}/aprobar/`, {});
  },

  rechazar(id: number) {
    return api.patch<DevolucionCompra>(`${baseUrl}/${id}/rechazar/`, {});
  },
};
