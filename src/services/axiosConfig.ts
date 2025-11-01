// services/axiosConfig.ts
import axios, { type AxiosInstance, type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

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
      // 1. Normalizar respuestas APIResponse
      (response: AxiosResponse) => {
        const res = response.data;

        // Si tiene la estructura típica de tu backend
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return res; // { success, message, data, errors? }
        }

        // Si no tiene esa estructura (casos raros)
        return { success: true, message: '', data: res };
      },

      // 2. Manejo de errores + refresh token
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

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
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Si el backend devolvió un APIResponse de error
        const res = error.response?.data;
        if (res && typeof res === 'object' && 'success' in res) {
          return Promise.reject(res);
        }

        // Si fue otro tipo de error
        return Promise.reject({
          success: false,
          message: 'Error inesperado al conectar con el servidor.',
          data: null,
        });
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const axiosInstance = new AxiosConfig().getInstance();
