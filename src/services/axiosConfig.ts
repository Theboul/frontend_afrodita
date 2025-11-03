// services/axiosConfig.ts
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./auth/authService";

// Tipo global de respuesta del backend
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "30000");

class AxiosConfig {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      withCredentials: true, // Importante para cookies HTTP-only
    });

    this.setupInterceptors();
  }

    private setupInterceptors(): void {
    // Interceptor de request
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => config,
      (error: AxiosError) => Promise.reject(error)
    );

    // Interceptor de response
    this.instance.interceptors.response.use(
      // Normalizamos la respuesta del backend
      (response: AxiosResponse): ApiResponse<any> | any => {
        const res = response.data;

        // Si tiene la estructura típica del backend
        if (res && typeof res === "object" && "success" in res && "data" in res) {
          return res; // { success, message, data, errors? }
        }

        // Si no tiene esa estructura (casos raros)
        return { success: true, message: "", data: res };
      },

      // Manejo de errores + refresh token
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Si el token expiró (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar refrescar token
            await authService.refreshAccessToken();
            // Reintentar la request original
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Si falla, forzar logout
            await authService.logout();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Si el backend devolvió un ApiResponse de error
        const res = error.response?.data;
        if (res && typeof res === "object" && "success" in res) {
          return Promise.reject(res);
        }

        // Si fue otro tipo de error
        return Promise.reject({
          success: false,
          message: "Error inesperado al conectar con el servidor.",
          data: null,
        });
      }
    );
  }


  // Aquí redefinimos los tipos de retorno de axiosInstance
  public getInstance<T = any>(): {
    get: (url: string, config?: any) => Promise<ApiResponse<T>>;
    post: (url: string, data?: any, config?: any) => Promise<ApiResponse<T>>;
    put: (url: string, data?: any, config?: any) => Promise<ApiResponse<T>>;
    patch: (url: string, data?: any, config?: any) => Promise<ApiResponse<T>>;
    delete: (url: string, config?: any) => Promise<ApiResponse<T>>;
  } {
    return this.instance as any;
  }
}

export const axiosInstance = new AxiosConfig().getInstance();
