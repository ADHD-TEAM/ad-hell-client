import api from './api.js';

export async function loginApi(username, password) {
    console.log("로그인 시작");
    return api.post('/api/v1/auth/login', { username, password})
}

export function refreshApi() {
    return api.post('/api/v1/auth/refresh')
}

export function logoutApi() {
    return api.post('/api/v1/auth/logout')
}

export function registerApi(payload) {
    return api.post('/api/v1/users', payload)
}