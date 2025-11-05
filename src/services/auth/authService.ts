// services/authService.ts
import { axiosInstance } from '../axiosConfig';

export interface LoginCredentials {
  credencial: string;
  contraseña: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  rol: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserData;
}

export interface ApiError {
  success: boolean;
  errors?: {
    non_field_errors?: string[];
    credencial?: string[];
    contraseña?: string[];
  };
  error?: string;
}

export type AuthError =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'INVALID_CREDENTIALS'
  | 'USER_INACTIVE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SERVER_ERROR'
  | 'INVALID_TOKEN'
  | 'REFRESH_TOKEN_EXPIRED';


class AuthService {
  private isRefreshing = false;

  // ======================
  // LOGIN
  // ======================
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post(
        '/api/auth/login/',
        credentials
      );

      // El interceptor ya devuelve el cuerpo normalizado, no AxiosResponse.
      // Puede ser { success, message, data } o { success, user }.
      const body: any = response as any;
      const payload = ('data' in body && body.data) ? body.data : body;

      if (body?.success && payload?.user) {
        this.saveUserData(payload.user);
      }

      return body;
    } catch (error: any) {
      const authError = this.handleAuthError(error);
      throw new Error(authError);
    }
  }

  // ======================
  // LOGOUT
  // ======================
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/api/auth/logout/');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      this.clearLocalStorage();
      window.location.href = '/login';
    }
  }

  // ======================
  // REFRESH TOKEN
  // ======================
  async refreshAccessToken(): Promise<void> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        const checkRefresh = setInterval(() => {
          if (!this.isRefreshing) {
            clearInterval(checkRefresh);
            resolve();
          }
        }, 100);
      });
    }

    this.isRefreshing = true;

    try {
      await axiosInstance.post('/api/auth/refresh/');
    } catch (error: any) {
      this.clearLocalStorage();
      const authError = this.handleAuthError(error);

      if (
        authError === 'INVALID_CREDENTIALS' ||
        authError === 'REFRESH_TOKEN_EXPIRED'
      ) {
        this.forceLogout();
      }

      throw new Error(authError);
    } finally {
      this.isRefreshing = false;
    }
  }

  // ======================
  // VERIFICAR SESIÓN
  // ======================
  async verifyToken(): Promise<UserData | null> {
    try {
      const response: any = await axiosInstance.get('/api/auth/verificar-sesion/');
      // El interceptor puede devolver { success, data: { user } } o { success, user }
      const body = response;
      const payload = ('data' in body && body.data) ? body.data : body;

      if (body?.success && payload?.user) {
        this.saveUserData(payload.user);
        return payload.user as UserData;
      }
      return null;
    } catch (error) {
      this.clearLocalStorage();
      return null;
    }
  }

  // ======================
  // INICIALIZAR AUTH
  // ======================
  async initializeAuth(): Promise<boolean> {
    try {
      const userData = await this.verifyToken();
      return !!userData;
    } catch (error) {
      this.clearLocalStorage();
      return false;
    }
  }

  // ======================
  // LOCAL STORAGE
  // ======================
  saveUserData(userData: UserData): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getUserData(): UserData | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  clearLocalStorage(): void {
    localStorage.removeItem('user');
  }

  forceLogout(): void {
    this.clearLocalStorage();
    window.location.href = '/login';
  }

  // ======================
  // MANEJO DE ERRORES
  // ======================
  private handleAuthError(error: any): AuthError {
    if (!error.response) {
      if (error.code === 'ECONNABORTED') return 'TIMEOUT_ERROR';
      return 'NETWORK_ERROR';
    }

    const status = error.response.status;
    const data: ApiError = error.response.data;

    switch (status) {
      case 400:
        if (data.errors?.credencial || data.errors?.contraseña) {
          return 'INVALID_CREDENTIALS';
        }
        return 'INVALID_CREDENTIALS';
      case 401:
        if (error.config?.url?.includes('refresh-token')) {
          return 'REFRESH_TOKEN_EXPIRED';
        }
        return 'INVALID_CREDENTIALS';
      case 403:
        if (
          data.error?.includes('inactivo') ||
          data.error?.includes('bloqueado')
        ) {
          return 'USER_INACTIVE';
        }
        return 'INVALID_CREDENTIALS';
      case 429:
        return 'RATE_LIMIT_EXCEEDED';
      case 500:
        return 'SERVER_ERROR';
      default:
        return 'SERVER_ERROR';
    }
  }

  getErrorMessage(errorType: AuthError): string {
    const errorMessages: Record<AuthError, string> = {
      NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
      TIMEOUT_ERROR: 'La solicitud está tardando demasiado. Intenta nuevamente.',
      INVALID_CREDENTIALS: 'Credenciales inválidas. Verifica tu usuario y contraseña.',
      USER_INACTIVE: 'Tu cuenta no está disponible. Contacta al soporte técnico.',
      RATE_LIMIT_EXCEEDED: 'Demasiados intentos. Espera unos minutos.',
      SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
      INVALID_TOKEN: 'Sesión inválida. Inicia sesión nuevamente.',
      REFRESH_TOKEN_EXPIRED: 'Sesión expirada. Inicia sesión nuevamente.',
    };

    return errorMessages[errorType];
  }
}

export const authService = new AuthService();
