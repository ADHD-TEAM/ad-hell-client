import api from './api.js';

export async function loginApi(userLoginId, password) {
    console.log("로그인 시작");
    return api.post('/auth/login', { userLoginId, password })
}

export function refreshApi() {
  return api.post('/auth/refresh',
      {},
      { skipAuth : true } // request interceptor에게 "Authorization" 속성을 붙이지 않도록 알림
  );
}

export function logoutApi() {
    return api.post('/auth/logout')
}

export function registerApi(payload) {
    return api.post('/api/users', payload)
}