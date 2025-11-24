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
