import axios from 'axios'
import { useAuthStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // HttpOnly refreshToken 쿠키 전송
  timeout: 10000
})

api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      if(authStore.accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
      }
      return config;
    },
    (error) => Promise.reject(error),
);

// 응답 인터셉터 (공통 에러 처리)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const authStore = useAuthStore();
      const originalRequest = error.config;

      if (!error.response) {
        return Promise.reject(error);
      }

      const status = error.response.status;
      const url = originalRequest.url || '';

      // TODO: 401 응답 처리 및 토큰 재발급, 재시도, clearAuthState 호출 등 인터셉터 로직 작성

      return Promise.reject(error);
    },
);

export default api
