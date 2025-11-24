// src/api/notificationTemplateApi.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
    baseURL: '/api',       // Vite proxy 기준
    withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
})

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
