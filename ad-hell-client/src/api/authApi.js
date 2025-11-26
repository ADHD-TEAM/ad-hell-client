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
    return api.post('/auth/logout');
}

export function registerApi(payload) {
    // 회원가입
    return api.post('/auth/signUp', payload);
}

export function isAvailableApi(payload) {
    // 닉네임, 로그인 아이디 사용가능한지 확인
    return api.post('/users/isAvailable', payload);
}

export function sendEmailbyCode(payload) {
    // 이메일 인증번호 보내기
    return api.post('/auth/email/send-code', payload);

}

