<!-- AdminSidebar.vue -->
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { icons } from '@/assets/icon/icons.js'

const router = useRouter()
const route = useRoute()

  // 관리자 사이드바 메뉴 (요청에 맞게 수정 완료)
const menus = [
  // 홈
  { id: 'home', label: '홈', path: '/', iconId: 'home' },

  // 회원
  { id: 'member-section', label: '회원', header: true },
  { id: 'member-manage', label: '회원관리', path: {name :'UserManagementList' }, iconId: 'user' },

  // 공지·문의·게시판
  { id: 'notice-section', label: '공지사항', header: true },
  { id: 'declaration-manage', label: '신고관리', path: '/admin/reports', iconId: 'declaration' },
  { id: 'board-manage', label: '게시판', path: '/admin/boards', iconId: 'board' },


  { id: 'inquiry-manage', label: '문의', path: '/admin/inquiries', iconId: 'qna' },
  { id: 'announcement-manage', label: '공지사항', path: '/admin/announcements', iconId: 'notice' },


  // 카테고리/알림 관리
  { id: 'category-noti-section', label: '카테고리/알림 관리', header: true },
  { id: 'category-manage', label: '카테고리', path: '/admin/categories', iconId: 'category' },
  { id: 'alarm-manage', label: '알림 템플릿', path: '/admin/alarms', iconId: 'notification' },
  { id: 'alarm-manage-send', label: '알림', path: '/admin/alarms/send', iconId: 'notification' },

  // 광고/경품 관리
  { id: 'ad-reward-section', label: '광고/ 경품 관리', header: true },
  { id: 'ad-manage', label: '광고관리', path: '/admin/ads', iconId: 'ad' },
  { id: 'reward-manage', label: '경품관리', path: '/admin/rewards', iconId: 'reward' },
]

const hoverId = ref(null)

const isActive = (item) => {
  if (!item.path) return false
  if (item.path === '/') return route.path === '/'
  // return route.fullPath.startsWith(item.path)
  // path 정확해야지만 작동
  return route.path === item.path
}

const iconSrc = (item) => {
  if (!item.iconId) return null
  const icon = icons[item.iconId]
  if (!icon) return null

  if (hoverId.value === item.id || isActive(item)) return icon.hover
  return icon.default
}

const go = (item) => {
  if (!item.path) return
  router.push(item.path)
}
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-inner">
      <template v-for="item in menus" :key="item.id">
        <div v-if="item.header" class="group-title">{{ item.label }}</div>

        <div
            v-else
            class="sidebar-item"
            :class="{ active: isActive(item) }"
            @mouseenter="hoverId = item.id"
            @mouseleave="hoverId = null"
            @click="go(item)"
        >
          <span class="menu-icon">
            <img
                v-if="iconSrc(item)"
                :src="iconSrc(item)"
                :alt="item.label"
            />
          </span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </template>
    </div>
  </aside>
</template>

<style scoped lang="scss">
/* 그대로 유지 */
.admin-sidebar {
  width: 244px;
  height: 1080px;
  background: #f6f7f9;
  display: flex;
  flex-direction: column;

  .sidebar-inner {
    padding: 16px 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 30px;

    .group-title {
      margin-top: 0;
      margin-bottom: 6px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-weight: 700;
      font-size: 16px;

      &:first-of-type {
        border-top: none;
      }
    }

    .sidebar-item {
      width: 204px;
      height: 40px;
      padding: 0 8px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: 0.15s;

      &:hover {
        background: #ffe2e0;
        border-color: #ff0000;
      }

      &.active {
        background: #ffe2e0;
        border-color: #ff0000;
      }

      .menu-icon img {
        width: 24px;
        height: 24px;
      }

      .menu-label {
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
}
</style>
