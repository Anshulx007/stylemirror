import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRecommendations as apiGetRecommendations } from '../services/api';
import { useAppStore } from './useAppStore';

export const useRecommendationStore = create(
  persist(
    (set) => ({
      outfit: null,
      hairstyles: null,
      accessories: null,
      palette: null,
      makeup: null,
      loading: false,
      recommendationId: null,
      
      getRecommendations: async (payload) => {
        set({ loading: true });
        try {
          const data = await apiGetRecommendations(payload);
          set({
            outfit: data.outfit,
            hairstyles: data.hairstyles,
            accessories: data.accessories,
            palette: data.palette,
            makeup: data.makeup,
            recommendationId: data.recommendation_id,
          });
          return data;
        } catch (err) {
          console.error('Failed to get recommendations', err);
          const errMsg = err.response?.data?.detail || err.message || 'Failed to generate recommendations. Please try again.';
          useAppStore.getState().showToast(errMsg, 'error');
          throw err;
        } finally {
          set({ loading: false });
        }
      },
      
      clearRecommendations: () => set({
        outfit: null,
        hairstyles: null,
        accessories: null,
        palette: null,
        makeup: null,
        recommendationId: null,
      }),
    }),
    {
      name: 'stylemirror-recommendation',
      partialize: (state) => ({
        outfit: state.outfit,
        hairstyles: state.hairstyles,
        accessories: state.accessories,
        palette: state.palette,
        makeup: state.makeup,
        recommendationId: state.recommendationId,
      }),
    }
  )
);
