import { create } from 'zustand';
import { getRecommendations as apiGetRecommendations } from '../services/api';

export const useRecommendationStore = create((set) => ({
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
}));
