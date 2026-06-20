import { create } from 'zustand';

let toastTimeout = null;

export const useAppStore = create((set) => ({
  loading: false,
  error: null,
  theme: 'dark',
  toast: null, // { message: string, type: 'success' | 'info' | 'warning' | 'error' }
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTheme: (theme) => set({ theme }),
  
  showToast: (message, type = 'error') => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    set({ toast: { message, type } });
    toastTimeout = setTimeout(() => {
      set({ toast: null });
      toastTimeout = null;
    }, 4000);
  },
  
  hideToast: () => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }
    set({ toast: null });
  },
  
  reset: () => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }
    set({ loading: false, error: null, toast: null });
  },
}));
