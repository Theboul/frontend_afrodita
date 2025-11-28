import { axiosInstance } from "../axiosConfig";

export type ReviewStatus = "PENDIENTE" | "PUBLICADA" | "RECHAZADA" | "OCULTA";

export interface Resena {
  id_resena: number;
  producto_id: string;
  producto_nombre: string;
  cliente_id: number;
  cliente_nombre: string;
  calificacion: number;
  comentario: string;
  estado: ReviewStatus;
  fecha_creacion: string;
}

export interface CrearResenaPayload {
  id_producto: string;
  calificacion: number;
  comentario: string;
}

type ListarParams = {
  producto?: string;
  estado?: ReviewStatus;
  page?: number;
  page_size?: number;
};

const unwrap = <T>(res: any): T => {
  if (res && typeof res === "object") {
    if ("success" in res && "data" in res) return res.data as T;
    if ("data" in res) return res.data as T;
  }
  return res as T;
};

const normalizeLista = (raw: any): Resena[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Resena[];
  if (Array.isArray(raw.results)) return raw.results as Resena[];
  if (raw.data && Array.isArray(raw.data.results)) return raw.data.results as Resena[];
  return (raw.results ?? raw.data ?? []) as Resena[];
};

export const resenaService = {
  listarPublicas: async (producto?: string): Promise<Resena[]> => {
    const res = await axiosInstance.get("/api/resenas/", { params: { producto } });
    return normalizeLista(unwrap(res));
  },

  listarAdmin: async (params?: ListarParams): Promise<Resena[]> => {
    const res = await axiosInstance.get("/api/resenas/", { params });
    return normalizeLista(unwrap(res));
  },

  obtener: async (id: number): Promise<Resena> => {
    const res = await axiosInstance.get(`/api/resenas/${id}/`);
    return unwrap<Resena>(res);
  },

  crear: async (payload: CrearResenaPayload): Promise<Resena> => {
    const res = await axiosInstance.post("/api/resenas/", payload);
    return unwrap<Resena>(res);
  },

  publicar: async (id: number) => {
    const res = await axiosInstance.post(`/api/resenas/${id}/publicar/`);
    return unwrap<Resena>(res);
  },

  rechazar: async (id: number) => {
    const res = await axiosInstance.post(`/api/resenas/${id}/rechazar/`);
    return unwrap<Resena>(res);
  },

  ocultar: async (id: number) => {
    const res = await axiosInstance.post(`/api/resenas/${id}/ocultar/`);
    return unwrap<Resena>(res);
  },

  eliminar: async (id: number) => {
    const res = await axiosInstance.delete(`/api/resenas/${id}/`);
    return unwrap(res);
  },
};
