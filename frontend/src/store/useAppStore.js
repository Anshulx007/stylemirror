import { create } from 'zustand';

export const useAppStore = create((set) => ({
  loading: false,
  error: null,
  theme: 'dark',
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTheme: (theme) => set({ theme }),
  reset: () => set({ loading: false, error: null }),
}));
