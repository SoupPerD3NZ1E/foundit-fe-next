import axios from 'axios';
import { storage } from '@/lib/auth/storage';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor — attach Bearer token (mirrors auth.interceptor.ts)
apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
