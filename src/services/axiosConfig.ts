// services/axiosConfig.ts
import axios, { type AxiosInstance, type AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AxiosConfig {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 segundos
      withCredentials: true, // Importante para cookies HTTP-only
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de request
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {return config},
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de response
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Intentar refrescar el token
            await authService.refreshAccessToken();
            // Reintentar la request original
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, hacer logout
            await authService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const axiosInstance = new AxiosConfig().getInstance();