import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth/authService';
import type { LoginCredentials, AuthError, UserData } from '../services/auth/authService';

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // LOGIN
      login: async (credentials: LoginCredentials) => {
        console.log('🏪 AuthStore: Iniciando login...');
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);
          console.log('🏪 AuthStore: Respuesta recibida:', { success: response.success, user: response.user?.username });
          
          if (response.success && response.user) {
            authService.saveUserData(response.user); //Sincroniza con localStorage
            console.log('🏪 AuthStore: Actualizando estado a autenticado');
            set({
              user: response.user,
              isAuthenticated: true,
              loading: false,
            });
            console.log('🏪 AuthStore: Estado actualizado exitosamente');
          }
        } catch (error: any) {
          console.error('🏪 AuthStore: Error en login:', error);
          set({ error: error.message as AuthError, loading: false });
          throw error;
        }
      },

      // LOGOUT
      logout: async () => {
        try {
          await authService.logout();
        } finally {
          authService.clearLocalStorage(); // 🔹 Limpia storage real
          set({ user: null, isAuthenticated: false, error: null });
          sessionStorage.removeItem('session_active');
        }
      },

      // VERIFICAR SESIÓN
      checkAuth: async () => {
        try {
          const userData = await authService.verifyToken();
          if (userData) authService.saveUserData(userData); // 🔹 Sincroniza storage
          set({
            user: userData,
            isAuthenticated: !!userData,
          });
        } catch {
          authService.clearLocalStorage();
          set({ user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
