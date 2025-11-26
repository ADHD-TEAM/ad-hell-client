<!-- NotificationBell.vue -->
<script setup>
import { computed, ref } from 'vue'
// import { BellFilled } from '@element-plus/icons-vue'

// 부모에서 아이콘 경로를 받는 props 정의
const props = defineProps({
  iconSrc: {
    type: String,
    required: true,
  },
})

const isNotificationOpen = ref(false)
const activeTab = ref('unread')

const notifications = ref([
  { id: 1, type: '댓글',   actor: '김철수',  message: '님이 회원님의 게시글에 댓글을 남겼어요.', read: false },
  { id: 2, type: '좋아요', actor: '이영희',  message: '님이 회원님의 게시글에 좋아요를 눌렀어요.', read: false },
  { id: 3, type: '시스템', actor: '',       message: '서비스 점검이 오늘 자정에 예정되어 있습니다.', read: true },
  { id: 4, type: '댓글',   actor: '박민수',  message: '님이 회원님의 게시글에 댓글을 남겼어요.', read: false },
  { id: 5, type: '좋아요', actor: '정하늘',  message: '님이 회원님의 게시글에 좋아요를 눌렀어요.', read: true },
  { id: 6, type: '시스템', actor: '',       message: '새로운 공지 사항이 등록되었습니다.', read: true },
  { id: 7, type: '댓글',   actor: '최가은',  message: '님이 회원님의 게시글에 댓글을 남겼어요.', read: false },
  { id: 8, type: '좋아요', actor: '오지훈',  message: '님이 회원님의 게시글에 좋아요를 눌렀어요.', read: false },
  { id: 9, type: '시스템', actor: '',       message: '보안 관련 안내 메일이 발송되었습니다.', read: true },
  { id:10, type: '댓글',   actor: '나애리',  message: '님이 회원님의 게시글에 댓글을 남겼어요.', read: false },
])


const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)
const filteredNotifications = computed(() =>
    notifications.value.filter((item) => (activeTab.value === 'unread' ? !item.read : item.read)),
)

const markAllRead = () => {
  notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
}

const markAsRead = (id) => {
  notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item,
  )
}

/** 개별 알림 삭제 */
const deleteNotification = (id) => {
  notifications.value = notifications.value.filter((item) => item.id !== id)
}

/** 읽은 알림 모두 삭제 */
const deleteAllRead = () => {
  notifications.value = notifications.value.filter((item) => !item.read)
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const toggleNotification = () => {
  isNotificationOpen.value = !isNotificationOpen.value
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
