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
<<<<<<< HEAD
  const res = await api.get('/users/me');
  const data = unwrapApiResponse(res, '사용자 정보를 불러오지 못했습니다.');
    return data.user ?? data.userDto ?? data.data ?? data; // UserDTO
=======
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

>>>>>>> develop
}

// 전체 회원 조회: UserListResponse { users: List<UserDTO> } 중 users만 반환
export async function fetchAllUsersApi() {
  const res = await api.get('/api/admin/users');
  const data = unwrapApiResponse(res, '회원 목록을 불러오지 못했습니다.');
  return data.users || [];
}

<<<<<<< HEAD
// 알림/인증용: /api/auth/me 호출해서 { userId, username, role } 받기
export async function fetchNotificationAuthMe() {
    const res = await api.get('/auth/me'); // 게이트웨이 기준 경로: /api/auth/me
    const data = res.data;

    // 백엔드 ApiResponse 형태: { success, data, message, ... }
    if (!data.success) {
        const err = new Error(data.message || '로그인 정보를 불러오지 못했습니다.');
        err.code = data.errorCode;
        err.raw = data;
        throw err;
    }

    // data.data: NotificationLoginUserInfoResponse { userId, username, role }
    return data.data;
}
=======
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
>>>>>>> develop
