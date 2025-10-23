import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.goopenly.xyz/api/v1';

console.log('🌐 [API Client] Base URL:', API_URL);

// Utility function for client-side API calls
export const createClientApiInstance = (token: string | null) => {
  console.log('🔧 [API Client] Creating API instance, token present:', !!token);
  
  const client = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Request interceptor for logging
  client.interceptors.request.use(
    (config) => {
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
      return config;
    },
    (error) => {
      console.error('❌ [API Request Error]', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    (error) => {
      console.error(`❌ [API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      if (error.response?.status === 401) {
        console.warn('🔒 [API] Unauthorized - redirecting to sign-in');
        // Handle unauthorized
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

