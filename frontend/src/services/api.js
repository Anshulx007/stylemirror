import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject default headers dynamically if needed
api.interceptors.request.use(
  (config) => {
    // If we're not sending FormData, ensure Content-Type is json
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize API error handling (timeouts, network losses, 500s)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network loss / Server unreachable
      console.error('Network error or server unreachable');
    } else if (error.response.status >= 500) {
      // Server-side crash
      console.error('Internal server error:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Retry wrapper with exponential backoff (1s, 2s, 4s) up to 3 retries max
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (err) {
    const isNetworkError = !err.response;
    const isServerError = err.response && err.response.status >= 500;
    
    // Only retry on connection loss/unreachable or server crash. Avoid retrying client 4xx validation errors.
    if ((isNetworkError || isServerError) && retries > 1) {
      console.warn(`Request failed. Retrying in ${delay}ms... (${retries - 1} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw err;
  }
};

export const analyzeImage = async (file) => {
  return retryRequest(async () => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/v1/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  });
};

export const uploadImage = analyzeImage;

export const getRecommendations = async (payload) => {
  return retryRequest(async () => {
    const response = await api.post('/api/v1/recommend', payload);
    return response.data;
  });
};

export const generateReport = async (imageId) => {
  return retryRequest(async () => {
    const response = await api.get(`/api/v1/report/data/${imageId}`);
    return response.data;
  });
};

export const generateMakeover = async (payload) => {
  return retryRequest(async () => {
    const response = await api.post('/api/v1/makeover', payload);
    return response.data;
  });
};

export const chat = async (messages, imageId) => {
  return retryRequest(async () => {
    const response = await api.post('/api/v1/chat', { messages, image_id: imageId });
    return response.data;
  });
};

export default {
  analyzeImage,
  uploadImage,
  getRecommendations,
  generateReport,
  generateMakeover,
  chat,
};
