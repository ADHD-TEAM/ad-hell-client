// src/api/notificationApi.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
    const authStore = useAuthStore()

    // 새로고침 직후 같은 상황 대비해서, 비어있으면 localStorage에서 복구
    if (!authStore.accessToken) {
        authStore.loadFromStorage()
    }

    const token = authStore.accessToken

    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// 공통 헬퍼 함수
async function getCurrentUserId() {
    const authStore = useAuthStore()

    // 로그인 안 되어 있으면 바로 에러
    if (!authStore.isLoggedIn) {
        throw new Error('[notificationApi] 로그인 상태가 아닙니다.')
    }

    // authStore.ensureUserId()가 필요하면 /users/me 부르면서 userId 채워줌
    const userId = await authStore.ensureUserId()

    if (!userId) {
        throw new Error('[notificationApi] 현재 로그인 유저의 userId가 없습니다.')
    }

    return userId
}

/**
 * 관리자 템플릿 목록/검색 조회
 */
export async function fetchAdminNotificationTemplates({
                                                          keyword = '',
                                                          page = 0,
                                                          size = 10,
                                                      } = {}) {
    const res = await apiClient.get('/admin/notifications/templates', {
        params: {
            keyword: keyword || undefined,
            page,
            size,
        },
    })

    return res.data?.data
}

/**
 * 관리자 템플릿 생성
 * 백엔드: POST /api/admin/notifications/templates
 * Body: { templateKind, templateTitle, templateBody }
 */
export async function createAdminNotificationTemplate({
                                                          templateKind = 'NORMAL',   // 일단 기본값 NORMAL
                                                          templateTitle,
                                                          templateBody,
                                                      }) {
    const res = await apiClient.post('/admin/notifications/templates', {
        templateKind,
        templateTitle,
        templateBody,
    })

    return res.data?.data
}

/**
 * 관리자 템플릿 수정
 * PUT /api/admin/notifications/templates/{templateId}
 */
export async function updateAdminNotificationTemplate(templateId, {
    templateKind = 'NORMAL',
    templateTitle,
    templateBody,
}) {
    const res = await apiClient.put(`/admin/notifications/templates/${templateId}`, {
        templateKind,
        templateTitle,
        templateBody,
    })

    return res.data?.data
}

/**
 * 관리자 템플릿 삭제
 * DELETE /api/admin/notifications/templates/{templateId}
 */
export async function deleteAdminNotificationTemplate(templateId) {
    const res = await apiClient.delete(
        `/admin/notifications/templates/${templateId}`,
    )

    return res.data
}

/**
 * 관리자용 알림 발송 내역 조회
 * GET /api/admin/notifications
 *
 * @param {Object} options
 *  - page: 0부터 시작
 *  - size: 페이지 크기
 */
export async function fetchAdminNotificationHistory({
                                                        page = 0,
                                                        size = 10,
                                                    } = {}) {
    const res = await apiClient.get('/admin/notifications', {
        params: { page, size },
    })

    return res.data.data
}

/**
 * 관리자 알림 발송(즉시)
 */
export async function sendAdminNotificationNow(templateId, request) {
    const res = await apiClient.post(
        `/admin/notifications/${templateId}/send`,
        request,
    )

    return res.data.data
}

/**
 * 관리자 알림 발송(예약)
 */
export async function reserveAdminNotification(templateId, request) {
    const res = await apiClient.post(
        `/admin/notifications/${templateId}/reserve`,
        request,
    )

    return res.data.data
}

/* ===================== 유저용 알림 API ===================== */

// 내 알림 목록 조회
export async function fetchMyNotifications({ page = 0, size = 10 } = {}) {
    const userId = await getCurrentUserId()

    const res = await apiClient.get(`/users/${userId}/notifications`, {
        params: { page, size },
    })
    return res.data.data
}

// 내 미읽음 개수 조회
export async function fetchMyUnreadCount() {
    const userId = await getCurrentUserId()

    const res = await apiClient.get(`/users/${userId}/notifications/unread-count`)
    return res.data.data
}

// 내 알림 하나 읽음 처리
export async function markMyNotificationRead(notificationId) {
    const userId = await getCurrentUserId()

    const res = await apiClient.patch(
        `/users/${userId}/notifications/${notificationId}/read`,
    )
    return res.data
}

// 내 알림 모두 읽음 처리
export async function markMyNotificationsReadAll() {
    const userId = await getCurrentUserId()

    const res = await apiClient.patch(`/users/${userId}/notifications/read-all`)
    return res.data
}

// 내 알림 하나 삭제
export async function deleteMyNotification(notificationId) {
    const userId = await getCurrentUserId()

    const res = await apiClient.delete(
        `/users/${userId}/notifications/${notificationId}`,
    )
    return res.data
}

// 읽은 알림 모두 삭제
export async function deleteMyReadNotifications() {
    const userId = await getCurrentUserId()

    const res = await apiClient.delete(`/users/${userId}/notifications/read-all`)
    return res.data
}

/* ===================== 푸시 설정 on/off ===================== */

// 현재 내 push 설정 조회
export async function fetchMyPushSetting() {
    // 로그인 체크 + 토큰 헤더 셋업은 인터셉터가 처리
    const res = await apiClient.get('/notifications/settings/push')
    // { success, data: { memberId, pushEnabled } }
    return res.data.data
}

// 내 push 설정 변경
export async function updateMyPushSetting(notificationStatus) {
    const userId = await getCurrentUserId()        // memberId
    const pushEnabled = notificationStatus === 'on' // 'on' → true, 'off' → false

    const res = await apiClient.patch('/notifications/settings/push', {
        memberId: userId,
        pushEnabled,
    })

    return res.data
}