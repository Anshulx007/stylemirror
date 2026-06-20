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
      occasion: null,
      season: null,
      budget: null,
      makeoverUrl: null,
      
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
            occasion: payload.occasion,
            season: payload.season,
            budget: payload.budget,
            makeoverUrl: null, // Reset on new recommendations
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
      
      setMakeoverUrl: (url) => set({ makeoverUrl: url }),

      clearRecommendations: () => set({
        outfit: null,
        hairstyles: null,
        accessories: null,
        palette: null,
        makeup: null,
        recommendationId: null,
        occasion: null,
        season: null,
        budget: null,
        makeoverUrl: null,
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
        occasion: state.occasion,
        season: state.season,
        budget: state.budget,
        makeoverUrl: state.makeoverUrl,
      }),
    }
  )
);
