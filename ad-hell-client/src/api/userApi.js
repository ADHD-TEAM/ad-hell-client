import api from './api';

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
  const res = await api.get('/users/me');
  const data = unwrapApiResponse(res, '사용자 정보를 불러오지 못했습니다.');
    return data.user ?? data.userDto ?? data.data ?? data; // UserDTO
}

// 전체 회원 조회: UserListResponse { users: List<UserDTO> } 중 users만 반환
export async function fetchAllUsersApi() {
  const res = await api.get('/api/admin/users');
  const data = unwrapApiResponse(res, '회원 목록을 불러오지 못했습니다.');
  return data.users || [];
}

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