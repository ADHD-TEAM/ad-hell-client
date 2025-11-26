import api from './api';
import { useAuthStore } from '@/stores/authStore';

// 공통 언래핑 유틸
function unwrapApiResponse(res, defaultErrorMessage) {
  const { success, data, message, errorCode } = res.data;
  if (!success) {
    const err = new Error(message || defaultErrorMessage || '요청에 실패했습니다.');
    err.code = errorCode;
    err.raw = res.data;
    throw err;
  }
  return data;
}

// 내 정보 조회: UserDetailResponse { user: UserDTO } 중 user만 반환
export async function fetchMyInfoApi() {
    const authStore = useAuthStore();
    try {
        const res = await api.get('/users/me', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`
            }
        });
        const data = unwrapApiResponse(res, '사용자 정보를 불러오지 못했습니다.');
        return data; // UserDTO
    } catch (error) {
        throw error;
    }
}

// 내 정보 수정
export async function updateMyInfoApi(payload) {
    const authStore = useAuthStore();
    try {
        const res = await api.put('/users/modify/info', payload,{
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`
            }
        });
        const data = unwrapApiResponse(res, '사용자 정보를 불러오지 못했습니다.');
        return data; // UserDTO
    } catch (error) {
        throw error;
    }

}

// 비밀번호 재설정
export async function updatePasswordApi(payload) {
    const authStore = useAuthStore();
    try {
        const res = await api.patch('/auth/chek/reset-password', payload);
        const data = unwrapApiResponse(res, '사용자 정보를 불러오지 못했습니다.');
        return data; // UserDTO
    } catch (error) {
        throw error;
    }

}

// 전체 회원 조회: UserListResponse { users: List<UserDTO> } 중 users만 반환
export async function fetchAllUsersApi() {
  const res = await api.get('/api/admin/users');
  const data = unwrapApiResponse(res, '회원 목록을 불러오지 못했습니다.');
  return data.users || [];
}

export function withdrawApi() {
    const authStore = useAuthStore();

    try {
        return api.delete('/users/withdraw', {
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`
            }
        });
        authStore.setAccessToken(null);
        authStore.setUser(null);
        return res;
    } catch (error) {
        throw error;
    }

}

export function userInfoListApi() {

}
