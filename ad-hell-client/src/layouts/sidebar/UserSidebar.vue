<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { icons } from '@/assets/icon/icons.js'

const router = useRouter()
const route = useRoute()

// 사이드바 메뉴 정의
const menus = [
  // 홈
  { id: 'home', label: '홈', path: '/', iconId: 'home' },

  // 즐겨찾기
  { id: 'favorite-section', label: '즐겨찾기', header: true },
  { id: 'favorite', label: '즐겨찾기한 광고', path: '/favorites', iconId: 'favorite' },

  // 카테고리
  { id: 'category-section', label: '카테고리', header: true },
  { id: 'music', label: '음악', path: '/categories?type=music', iconId: 'music' },
  { id: 'movie', label: '영화', path: '/categories?type=movie', iconId: 'movie' },
  { id: 'shopping', label: '쇼핑', path: '/categories?type=shopping', iconId: 'shopping' },
  { id: 'game', label: '게임', path: '/categories?type=game', iconId: 'game' },
  { id: 'sports', label: '스포츠', path: '/categories?type=sports', iconId: 'sports' },
  { id: 'learning', label: '학습', path: '/categories?type=learning', iconId: 'learning' },

  // 문의 / 공지사항 / 게시판
  { id: 'board-section', label: '문의/공지사항/게시판', header: true },
  { id: 'announcement', label: '공지사항', path: '/announcements', iconId: 'notice' },
  { id: 'inquiry', label: '문의', path: '/inquiries', iconId: 'qna' },
  { id: 'board', label: '게시판', path: '/boards', iconId: 'board' },
]

// hover 중인 메뉴 id
const hoverId = ref(null)

// 현재 활성 메뉴 판단
const isActive = (item) => {
  if (!item.path) return false

  // 홈은 path 정확히 일치
  if (item.path === '/') return route.path === '/'

  // 카테고리처럼 ?type= 쿼리가 있는 애들까지 고려해서 fullPath 기준으로 비교
  return route.fullPath.startsWith(item.path)
}

// 아이콘 선택 (hover / active)
const iconSrc = (item) => {
  if (!item.iconId) return null
  const icon = icons[item.iconId]
  if (!icon) return null

  if (hoverId.value === item.id || isActive(item)) return icon.hover
  return icon.default
}

// 메뉴 클릭 시 라우팅
const go = (item) => {
  if (!item.path) return
  router.push(item.path)
}
</script>

<template>
  <aside class="user-sidebar">
    <div class="sidebar-inner">
      <template v-for="item in menus" :key="item.id">
        <!-- 섹션 타이틀 -->
        <div v-if="item.header" class="group-title">
          {{ item.label }}
        </div>

        <!-- 실제 메뉴 -->
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
