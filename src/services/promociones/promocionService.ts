import { axiosInstance } from "../axiosConfig";

export type PromotionType =
  | "DESCUENTO_PORCENTAJE"
  | "DESCUENTO_MONTO"
  | "COMBO"
  | "DOS_X_UNO";

export type PromotionStatus = "ACTIVA" | "INACTIVA";

export interface PromotionProduct {
  id_producto: string;
  nombre: string;
  precio: string;
  estado_producto?: string;
}

export interface Promotion {
  id_promocion: number;
  nombre: string;
  descripcion: string | null;
  codigo_descuento: string;
  tipo: PromotionType;
  valor_descuento: number | null;
  fecha_inicio: string;
  fecha_fin: string;
  estado: PromotionStatus;
  productos: PromotionProduct[];
}

export interface PromotionCreatePayload {
  nombre: string;
  descripcion?: string | null;
  codigo_descuento: string;
  tipo: PromotionType;
  valor_descuento?: number | null;
  fecha_inicio: string;
  fecha_fin: string;
  productos: string[];
}

const unwrap = <T>(res: any): T => {
  if (res && typeof res === "object" && "success" in res && "data" in res) {
    return res.data;
  }
  return res;
};

export const promocionService = {
  listar: async (): Promise<Promotion[]> => {
    const res = await axiosInstance.get("/api/promociones/");
    return unwrap<Promotion[]>(res);
  },

  obtener: async (id: number): Promise<Promotion> => {
    const res = await axiosInstance.get(`/api/promociones/${id}/`);
    return unwrap<Promotion>(res);
  },

  crear: async (payload: PromotionCreatePayload): Promise<Promotion> => {
    const res = await axiosInstance.post("/api/promociones/", payload);
    return unwrap<Promotion>(res);
  },

  actualizar: async (
    id: number,
    payload: Partial<Omit<PromotionCreatePayload, "productos">>
  ): Promise<Promotion> => {
    const res = await axiosInstance.patch(`/api/promociones/${id}/`, payload);
    return unwrap<Promotion>(res);
  },

  eliminar: async (id: number) => {
    return axiosInstance.delete(`/api/promociones/${id}/`);
  },

  activar: async (id: number) => {
    return axiosInstance.post(`/api/promociones/${id}/activar/`);
  },

  desactivar: async (id: number) => {
    return axiosInstance.post(`/api/promociones/${id}/desactivar/`);
  },
};
