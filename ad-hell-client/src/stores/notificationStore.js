// src/stores/notificationStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([])    // 현재 페이지 알림 목록
    const unreadCount = ref(0)       // 뱃지 숫자
    const sse = ref(null)            // EventSource 인스턴스
    const connected = ref(false)

    const authStore = useAuthStore()

    // 1) 최초 목록 불러오기 (알림 모달 열 때 사용)
    async function loadNotifications(page = 0, size = 10) {
        if (!authStore.user) return

        const userId = authStore.user.userId
        const res = await apiClient.get(`/api/users/${userId}/notifications`, {
            params: { page, size }
        })

        // ApiResponse<NotificationPageResponse> 형태라 가정
        notifications.value = res.data.data.notifications
    }

    // 2) 미읽음 개수 한번 가져오기
    async function fetchUnreadCount() {
        if (!authStore.user) return
        const userId = authStore.user.userId

        const res = await apiClient.get(`/api/users/${userId}/notifications/unread-count`)
        unreadCount.value = res.data.data
    }

    // 3) SSE 연결
    function connectSse() {
        if (connected.value || !authStore.user) return

        const userId = authStore.user.userId
        // 백엔드 주소 맞춰서
        const url = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}/notifications/stream`

        const es = new EventSource(url, { withCredentials: true })
        sse.value = es

        es.addEventListener('INIT', (event) => {
            console.log('[SSE] INIT', event.data)
        })

        // 새 알림이 도착했을 때
        es.addEventListener('NOTIFICATION', async (event) => {
            const payload = JSON.parse(event.data)
            console.log('[SSE] NOTIFICATION', payload)

            // 현재 리스트 맨 앞에 추가
            notifications.value.unshift({
                notificationId: payload.notificationId,
                notificationTitle: payload.notificationTitle,
                notificationBody: payload.notificationBody,
                readYn: payload.read ? 'Y' : 'N',
                createdAt: payload.createdAt
            })
        })

        // 미읽음 카운트 갱신 이벤트
        es.addEventListener('UNREAD_COUNT', (event) => {
            const payload = JSON.parse(event.data)   // { count: number }
            console.log('[SSE] UNREAD_COUNT', payload)
            unreadCount.value = payload.count
        })

        es.addEventListener('PING', () => {
            // console.log('[SSE] PING')
        })

        es.onerror = (err) => {
            console.error('[SSE] error', err)
            es.close()
            connected.value = false
            sse.value = null
            // 필요하면 여기서 재연결 로직 넣기
        }

        connected.value = true
    }

    // 4) SSE 해제 (로그아웃 시)
    function disconnectSse() {
        if (sse.value) {
            sse.value.close()
            sse.value = null
        }
        connected.value = false
        notifications.value = []
        unreadCount.value = 0
    }

    return {
        notifications,
        unreadCount,
        connected,
        loadNotifications,
        fetchUnreadCount,
        connectSse,
        disconnectSse
    }
})
