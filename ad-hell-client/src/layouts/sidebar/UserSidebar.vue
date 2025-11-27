<!-- src/components/layout/UserSidebar.vue -->
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { icons } from '@/assets/icon/icons.js'

const router = useRouter()
const route = useRoute()

const menus = [
  { id: 'home', label: '홈', path: '/', iconId: 'home' },

  { id: 'favorite-section', label: '즐겨찾기', header: true },
  { id: 'favorite', label: '즐겨찾기한 광고', path: '/favorites', iconId: 'favorite' },

  { id: 'category-section', label: '카테고리', header: true },
  { id: 'music', label: '음악', path: '/music', iconId: 'music' },
  { id: 'movie', label: '영화', path: '/movie', iconId: 'movie' },
  { id: 'shopping', label: '쇼핑', path: '/shopping', iconId: 'shopping' },
  { id: 'game', label: '게임', path: '/game', iconId: 'game' },
  { id: 'sports', label: '스포츠', path: '/sport', iconId: 'sports' },
  { id: 'learning', label: '학습', path: '/education', iconId: 'learning' },

  { id: 'board-section', label: '문의/공지사항/게시판', header: true },
  { id: 'announcement', label: '공지사항', path: '/announcements', iconId: 'notice' },
  { id: 'inquiry', label: '문의', path: '/mypage/inquiries', iconId: 'qna' },
  { id: 'board', label: '게시판', path: '/boards', iconId: 'board' },
  { id: 'reward', label: '경품', path: '/rewards', iconId: 'reward'}
]

const hoverId = ref(null)

const isActive = (item) => {
  if (!item.path) return false
  if (item.path === '/') return route.path === '/'
  return route.fullPath.startsWith(item.path)
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
  <aside class="user-sidebar">
    <div class="sidebar-inner">
      <template v-for="item in menus" :key="item.id">
        <div v-if="item.header" class="group-title">
          {{ item.label }}
        </div>

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
.user-sidebar {
  width: 244px;
  min-height: 100vh;      /* 🔹 전체 높이 고정 */
  background: #f6f7f9;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb; /* 🔹 오른쪽 구분선 */

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
