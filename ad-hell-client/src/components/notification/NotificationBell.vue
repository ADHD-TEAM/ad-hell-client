<!-- NotificationBell.vue -->
<script setup>
import {computed, onMounted, ref} from 'vue'
import { useAuthStore } from '@/stores/authStore'
import {
  markMyNotificationRead,
  markMyNotificationsReadAll,
  deleteMyNotification,
  deleteMyReadNotifications,
} from '@/api/notificationApi.js'
import {useNotificationStore} from "@/stores/notificationStore.js";

const props = defineProps({
  iconSrc: {
    type: String,
    required: true,
  },
})

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// ===== 상태 =====
const isNotificationOpen = ref(false)
const hasLoaded = ref(false)
const activeTab = ref('unread')

// store.notifications 를 화면용 형태로 변환
const uiNotifications = computed(() =>
    notificationStore.notifications.map((n) => ({
      id: n.notificationId,
      type: '시스템',
      actor: '',
      message: n.notificationBody,
      read: n.readYn === 'Y',
      createdAt: n.createdAt,
    })),
)

// 뱃지 숫자도 store.unreadCount 사용
const unreadCount = computed(() => notificationStore.unreadCount)

// 탭 필터링
const filteredNotifications = computed(() => {
  const list = uiNotifications.value
  if (activeTab.value === 'unread') {
    return list.filter((n) => !n.read)
  }
  return list.filter((n) => n.read)
})


// ===== API 호출 =====

// 페이지 로딩 시 미리 1번 가져오기
onMounted(async () => {
  if (authStore.isLoggedIn && !notificationStore.notifications.length) {
    await notificationStore.loadNotifications(0)
  }
})

// ====== 읽음 / 삭제 ======

// 단건 읽음
const markAsRead = async (id) => {
  try {
    await markMyNotificationRead(id)
    await notificationStore.loadNotifications(0)
    await notificationStore.fetchUnreadCount()
  } catch (err) {
    console.error('[NotificationBell] 알림 읽음 처리 실패:', err)
  }
}

// 모두 읽음
const markAllRead = async () => {
  try {
    await markMyNotificationsReadAll()
    await notificationStore.loadNotifications(0)
    await notificationStore.fetchUnreadCount()
  } catch (err) {
    console.error('[NotificationBell] 알림 모두 읽음 처리 실패:', err)
  }
}

// 개별 삭제
const deleteNotification = async (id) => {
  try {
    await deleteMyNotification(id)
    await notificationStore.loadNotifications(0)
    await notificationStore.fetchUnreadCount()
  } catch (err) {
    console.error('[NotificationBell] 알림 삭제 실패:', err)
  }
}

// 읽은 알림 모두 삭제
const deleteAllRead = async () => {
  try {
    await deleteMyReadNotifications()
    await notificationStore.loadNotifications(0)
    await notificationStore.fetchUnreadCount()
  } catch (err) {
    console.error('[NotificationBell] 읽은 알림 전체 삭제 실패:', err)
  }
}


// ===== UI 관련 =====

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const toggleNotification = async () => {
  isNotificationOpen.value = !isNotificationOpen.value

  if (isNotificationOpen.value && !hasLoaded.value) {
    await Promise.all([
      notificationStore.loadNotifications(0),
      notificationStore.fetchUnreadCount(),
    ])
    hasLoaded.value = true
  }
}


const closeNotification = () => {
  isNotificationOpen.value = false
}
</script>

<template>
  <el-popover
      placement="bottom-end"
      trigger="click"
      :visible="isNotificationOpen"
      popper-class="notification-popper"
      width="440"
      @hide="closeNotification"
  >
    <template #reference>
      <el-badge
          :value="unreadCount"
          :hidden="unreadCount === 0"
          class="notification-badge"
          type="danger"
      >
        <!-- 부모에서 받은 아이콘을 클릭 트리거로 사용 -->
        <img
            :src="props.iconSrc"
            alt="알림"
            class="alert-icon"
            @click="toggleNotification"
        />
      </el-badge>
    </template>

    <div class="notification-panel">
      <div class="panel-header">
        <div class="dialog-tabs">
          <button
              :class="['dialog-tab', { active: activeTab === 'unread' }]"
              type="button"
              @click="setActiveTab('unread')"
          >
            읽지 않음
          </button>
          <button
              :class="['dialog-tab', { active: activeTab === 'read' }]"
              type="button"
              @click="setActiveTab('read')"
          >
            읽음
          </button>
        </div>

        <!-- 탭에 따라 버튼/텍스트 변경 -->
        <el-button
            v-if="activeTab === 'unread'"
            size="small"
            type="danger"
            plain
            @click="markAllRead"
        >
          모두 읽음
        </el-button>
        <el-button
            v-else
            size="small"
            type="danger"
            plain
            @click="deleteAllRead"
        >
          모두 삭제
        </el-button>
      </div>


      <div v-if="filteredNotifications.length" class="notification-list">
        <div
            v-for="item in filteredNotifications"
            :key="item.id"
            class="notification-item"
            :class="{ unread: !item.read }"
        >
          <div class="notification-content">
            <span class="notification-type">{{ item.type }}</span>
            <span class="notification-text">
      <strong v-if="item.actor">{{ item.actor }}</strong>
      {{ item.message }}
    </span>
          </div>

          <!-- 탭에 따라 버튼/텍스트/동작 변경 -->
          <el-button
              v-if="activeTab === 'unread'"
              size="small"
              type="danger"
              class="read-badge"
              @click="markAsRead(item.id)"
          >
            읽음
          </el-button>
          <el-button
              v-else
              size="small"
              type="danger"
              class="read-badge"
              @click="deleteNotification(item.id)"
          >
            삭제
          </el-button>
        </div>
      </div>
      <div v-else class="notification-empty">표시할 알림이 없습니다.</div>
    </div>
  </el-popover>
</template>

<style scoped>

.notification-badge :deep(.el-badge__content) {
  top: 8px;
  right: auto;
  left: 4px;
  transform: translate(-50%, -50%);  /* 기본은 (50%, -50%)라 오른쪽으로 치우쳐져 있어서 반대로 */
}

.notification-button {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #ff4d4f;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notification-button:hover {
  background: #fff1f0;
  color: #d32f2f;
}

.notification-popper {
  padding: 0;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

.notification-panel {
  width: 100%;
  background: #ffffff;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f1f2f6;
}

.dialog-tabs {
  display: flex;
  gap: 8px;
}

.dialog-tab {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog-tab.active {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #ffffff;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 16px 16px;

  max-height: 260px;      /* 대략 알림 4개 정도 높이 */
  overflow-y: auto;
  overflow-x: hidden;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #f1f2f6;
  background: #fdfdfd;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.notification-item.unread {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.notification-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  min-width: 52px;
  height: 32px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #111827;
  font-weight: 700;
  font-size: 13px;
}

.notification-text {
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
  word-break: keep-all;
}

.notification-text strong {
  margin-right: 4px;
}

.read-badge {
  border-radius: 999px;
  padding: 6px 14px;
  min-width: 64px;
  background: #ff4d4f;
  border-color: #ff4d4f;
  font-weight: 700;
}

.read-badge:hover {
  filter: brightness(0.95);
}

.notification-empty {
  padding: 32px 16px 40px;
  text-align: center;
  color: #9ca3af;
}

.alert-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  /* 필요하면 아래처럼 둥근 테두리 정도는 자유롭게
  border-radius: 50%;
  */
}
</style>
