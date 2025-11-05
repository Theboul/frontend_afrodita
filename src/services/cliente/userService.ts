// services/userService.ts
import { axiosInstance } from "../axiosConfig";
import { type UserData } from "../auth/authService";
import { extractData, validateSuccess } from "../../utils/apiResponseHandler";

export interface EstadisticasCliente {
  total_direcciones: number;
  tiene_direccion_principal: boolean;
  fecha_registro: string;
  ultimo_login: string;
}

export const userService = {
  // Obtener perfil del cliente autenticado
  async obtenerPerfil(): Promise<UserData> {
    const res = await axiosInstance.get("/api/usuarios/perfil/me/");
    return extractData<UserData>(res, 'perfil');
  },

  // Actualizar perfil del cliente
  async actualizarPerfil(data: Partial<UserData>): Promise<UserData> {
    const res = await axiosInstance.patch("/api/usuarios/perfil/actualizar/", data);
    return extractData<UserData>(res, 'perfil');
  },

  // Cambiar contraseña
  async cambiarPassword(payload: {
    contraseña_actual: string;
    contraseña_nueva: string;
    confirmar_contraseña: string;
  }): Promise<void> {
    const res = await axiosInstance.post("/api/usuarios/perfil/cambiar-password/", payload);
    validateSuccess(res);
  },

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<EstadisticasCliente> {
    const res = await axiosInstance.get("/api/usuarios/perfil/estadisticas/");
    return extractData<EstadisticasCliente>(res, 'estadisticas');
  },
};
