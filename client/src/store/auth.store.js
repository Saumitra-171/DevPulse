import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
        return data;
      },

      register: async (username, email, password) => {
        const { data } = await api.post('/auth/register', { username, email, password });
        set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
        return data;
      },

      logout: async () => {
        try {
          await api.post('/auth/logout', { refreshToken: get().refreshToken });
        } catch {}
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'devpulse-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);