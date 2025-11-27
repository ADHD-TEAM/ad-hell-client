// src/stores/notificationStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import {
    fetchMyNotifications,
    fetchMyUnreadCount,
} from '@/api/notificationApi.js'

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref([])    // 현재 페이지 알림 목록 (원본 데이터)
    const unreadCount = ref(0)       // 뱃지 숫자
    const sse = ref(null)
    const connected = ref(false)

    const authStore = useAuthStore()

    // 1) 최초 목록 불러오기 (알림 모달 열 때 사용)
    async function loadNotifications(page = 0, size = 10) {
        if (!authStore.user) return

        const pageRes = await fetchMyNotifications({ page, size })
        // pageRes.notifications : 백엔드 NotificationSummaryResponse 리스트
        notifications.value = pageRes.notifications.map((n) => {
            const isRead =
                n.read === true ||
                n.read === 'Y' ||
                n.read === 'y' ||
                n.read === 1 ||
                n.readYn === 'Y' ||
                n.readYn === 'y'

            return {
                notificationId: n.notificationId,
                notificationTitle: n.notificationTitle,
                notificationBody: n.notificationBody,
                readYn: isRead ? 'Y' : 'N',
                createdAt: n.createdAt,
            }
        })
    }

    // 2) 미읽음 개수 한 번 가져오기
    async function fetchUnreadCount() {
        if (!authStore.user) return
        const cnt = await fetchMyUnreadCount()
        unreadCount.value = cnt
    }


    // 3) SSE 연결
    function connectSse() {
        if (connected.value || !authStore.user) return

        const userId = authStore.user.userId
        // 게이트웨이 기준: /api/users/{userId}/notifications/stream
        const url = `/api/users/${userId}/notifications/stream`

        const es = new EventSource(url, { withCredentials: true })
        sse.value = es

        es.addEventListener('INIT', (event) => {
            console.log('[SSE] INIT', event.data)
        })

        es.addEventListener('NOTIFICATION', (event) => {
            const payload = JSON.parse(event.data)
            console.log('[SSE] NOTIFICATION', payload)

            notifications.value.unshift({
                notificationId: payload.notificationId,
                notificationTitle: payload.notificationTitle,
                notificationBody: payload.notificationBody,
                readYn: payload.read ? 'Y' : 'N',
                createdAt: payload.createdAt,
            })
        })

        es.addEventListener('UNREAD_COUNT', (event) => {
            const payload = JSON.parse(event.data)
            console.log('[SSE] UNREAD_COUNT', payload)
            unreadCount.value = payload.count
        })

        es.addEventListener('PING', () => {
            // keep-alive
        })

        es.onerror = (err) => {
            console.error('[SSE] error', err)
            es.close()
            connected.value = false
            sse.value = null
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
