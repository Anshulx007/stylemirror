import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { analyzeImage as apiAnalyzeImage } from '../services/api';
import { useAppStore } from './useAppStore';

export const useImageStore = create(
  persist(
    (set, get) => ({
      image: null,
      imageId: null,
      previewUrl: null,
      faceShape: null,
      skinTone: null,
      hairType: null,
      currentStyle: null,
      fashionScore: null,
      
      setImage: (file, previewUrl) => set({ image: file, previewUrl }),
      
      analyzeImage: async () => {
        const { image } = get();
        if (!image) return;
        
        const { setLoading, setError } = useAppStore.getState();
        setLoading(true);
        setError(null);
        
        try {
          const data = await apiAnalyzeImage(image);
          set({
            imageId: data.image_id,
            previewUrl: `http://127.0.0.1:8000${data.preview_url}`,
            faceShape: data.face_shape,
            skinTone: data.skin_tone,
            hairType: data.hair_type,
            currentStyle: data.current_style,
            fashionScore: data.fashion_score,
          });
        } catch (err) {
          const errMsg = err.response?.data?.detail || err.message || 'Image analysis failed. Please try again.';
          setError(errMsg);
          useAppStore.getState().showToast(errMsg, 'error');
          throw err;
        } finally {
          setLoading(false);
        }
      },
      
      clearImage: () => set({
        image: null,
        imageId: null,
        previewUrl: null,
        faceShape: null,
        skinTone: null,
        hairType: null,
        currentStyle: null,
        fashionScore: null,
      }),
    }),
    {
      name: 'stylemirror-image',
      partialize: (state) => ({
        imageId: state.imageId,
        previewUrl: state.previewUrl,
        faceShape: state.faceShape,
        skinTone: state.skinTone,
        hairType: state.hairType,
        currentStyle: state.currentStyle,
        fashionScore: state.fashionScore,
      }),
    }
  )
);
