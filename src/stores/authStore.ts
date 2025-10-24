import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth/authService';
import type { LoginCredentials, AuthError, UserData } from '../services/auth/authService';

// Definimos la interfaz del estado global
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

      login: async (credentials: LoginCredentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authService.login(credentials);
          if (response.success) {
            set({
              user: response.user,
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (error: any) {
          set({ error: error.message as AuthError, loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ user: null, isAuthenticated: false, error: null });
          sessionStorage.removeItem('session_active');
        }
      },

      checkAuth: async () => {
        try {
          const userData = await authService.verifyToken();
          set({
            user: userData,
            isAuthenticated: !!userData,
          });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // 🔹 Tipamos el parámetro `state` correctamente
      partialize: (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
