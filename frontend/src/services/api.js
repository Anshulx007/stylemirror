import axios from 'axios';

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
