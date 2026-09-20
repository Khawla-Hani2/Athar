import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { loginRequest, logoutRequest } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginAsRole: (user: User) => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await loginRequest(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },
      loginAsRole: (user) => set({ user, isAuthenticated: true, error: null }),
      logout: async () => {
        await logoutRequest();
        set({ user: null, isAuthenticated: false });
      },
      clearError: () => set({ error: null }),
    }),
    { name: 'capsule-auth' },
  ),
);
