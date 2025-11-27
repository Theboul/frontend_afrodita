import { axiosInstance } from "../../services/axiosConfig";
import type { ApiResponse } from "../../services/axiosConfig";



export interface DireccionCliente {
  id_direccion: number;
  etiqueta: string;
  direccion: string;
  ciudad: string;
  es_principal: boolean;
  guardada: boolean;
}

export interface TipoEnvio {
  cod_tipo_envio: number;
  tipo: string;
}

export interface EnvioPayload {
  fecha_envio: string;
  costo: number;
  estado_envio: string;
  cod_tipo_envio: number;
  id_direccion: number;
}

export interface NuevaDireccionPayload {
  etiqueta: string;
  direccion: string;
  ciudad: string;
  departamento?: string;
  referencia?: string;
}


export const getPerfilCliente = async (): Promise<ApiResponse> => {
  return await axiosInstance.get("/api/usuarios/perfil/me/");
};

export const getDireccionesCliente = async (): Promise<DireccionCliente[]> => {
  const res = await axiosInstance.get("/api/usuarios/perfil/direcciones/");
  const data = (res as any)?.data;

  if (data && data.direcciones) {
    return data.direcciones;
  }

  return [];
};


export async function getTiposEnvio(): Promise<TipoEnvio[]> {
  try {
    const response = await axiosInstance.get("/api/envios/tipo-envio/");
    console.log("📦 TIPOS ENVIO RESPONSE:", response.data);

    if (response.data.results) {
      return response.data.results;
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener tipos de envío", error);
    return [];
  }
}

export const crearEnvio = async (payload: EnvioPayload) => {
  const res = await axiosInstance.post("/api/envios/envios/", payload);
  return res.data;
};


export const crearDireccionCliente = async (payload: NuevaDireccionPayload) => {
  const res = await axiosInstance.post("/api/usuarios/perfil/direcciones/", payload);
  return res.data;
};
