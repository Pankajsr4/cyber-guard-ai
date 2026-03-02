import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const moderationAPI = {
  // Analyze single content
  analyze: async (data: { content: string; language?: string; context?: string[] }) => {
    const response = await api.post('/analyze', data);
    return response.data;
  },

  // Batch analyze
  analyzeBatch: async (items: Array<{ content: string }>) => {
    const response = await api.post('/analyze/batch', { items });
    return response.data;
  },

  // Real-time moderation
  moderate: async (data: { content: string; user_id?: string }) => {
    const response = await api.post('/moderate', data);
    return response.data;
  },

  // AI rewrite
  rewrite: async (data: { content: string; tone?: string; preserve_meaning?: boolean }) => {
    const response = await api.post('/rewrite', data);
    return response.data;
  },

  // PII redaction
  redactPII: async (data: { content: string }) => {
    const response = await api.post('/privacy/redact', data);
    return response.data;
  },

  // Health check
  health: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
