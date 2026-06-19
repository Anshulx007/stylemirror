import os

base_dir = r"c:\Users\hp\mirrorai\frontend\src"

def write_src_file(rel_path, content):
    full_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created file: {rel_path}")

# ==================== 1. API SERVICE LAYER ====================
api_js = """import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/v1/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Alias for uploadImage as specified in checklist
export const uploadImage = analyzeImage;

export const getRecommendations = async (payload) => {
  const response = await api.post('/api/v1/recommend', payload);
  return response.data;
};

export const generateMakeover = async (payload) => {
  const response = await api.post('/api/v1/makeover', payload);
  return response.data;
};

export const chat = async (messages, imageId) => {
  const response = await api.post('/api/v1/chat', { messages, image_id: imageId });
  return response.data;
};

export default {
  analyzeImage,
  uploadImage,
  getRecommendations,
  generateMakeover,
  chat,
};
"""

# ==================== 2. ZUSTAND STORES ====================
use_app_store = """import { create } from 'zustand';

export const useAppStore = create((set) => ({
  loading: false,
  error: null,
  theme: 'dark',
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setTheme: (theme) => set({ theme }),
  reset: () => set({ loading: false, error: null }),
}));
"""

use_image_store = """import { create } from 'zustand';
import { analyzeImage as apiAnalyzeImage } from '../services/api';
import { useAppStore } from './useAppStore';

export const useImageStore = create((set, get) => ({
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
      setError(err.response?.data?.detail || 'Image analysis failed. Please try again.');
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
}));
"""

use_recommendation_store = """import { create } from 'zustand';
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
"""

use_chat_store = """import { create } from 'zustand';
import { chat as apiChat } from '../services/api';

export const useChatStore = create((set, get) => ({
  messages: [],
  typing: false,
  
  sendMessage: async (text, imageId) => {
    const newMsg = { role: 'user', content: text };
    set((state) => ({ 
      messages: [...state.messages, newMsg],
      typing: true 
    }));
    
    try {
      const allMessages = get().messages;
      const data = await apiChat(allMessages, imageId);
      const assistantMsg = { role: 'assistant', content: data.reply };
      set((state) => ({ 
        messages: [...state.messages, assistantMsg] 
      }));
    } catch (err) {
      console.error('Chat error', err);
      set((state) => ({ 
        messages: [...state.messages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }] 
      }));
    } finally {
      set({ typing: false });
    }
  },
  
  clearChat: () => set({ messages: [], typing: false }),
}));
"""

use_report_store = """import { create } from 'zustand';

export const useReportStore = create((set) => ({
  report: null,
  pdfUrl: null,
  
  generateReport: async (imageId) => {
    // Basic mock generator for Phase 4 Style Report
    const mockReport = {
      title: 'StyleMirror AI Style Report',
      date: new Date().toLocaleDateString(),
      imageId: imageId,
    };
    set({ report: mockReport, pdfUrl: `http://127.0.0.1:8000/api/v1/report/pdf/${imageId}` });
    return mockReport;
  },
  
  downloadReport: async (imageId) => {
    window.open(`http://127.0.0.1:8000/api/v1/report/pdf/${imageId}`, '_blank');
  },
}));
"""

write_src_file("services/api.js", api_js)
write_src_file("store/useAppStore.js", use_app_store)
write_src_file("store/useImageStore.js", use_image_store)
write_src_file("store/useRecommendationStore.js", use_recommendation_store)
write_src_file("store/useChatStore.js", use_chat_store)
write_src_file("store/useReportStore.js", use_report_store)

print("API layer and Zustand stores created successfully.")
