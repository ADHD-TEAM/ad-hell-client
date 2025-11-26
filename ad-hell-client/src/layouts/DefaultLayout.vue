<template>
  <div class="layout">
    <!-- 공통 헤더 -->
    <CommonUserHeadBar class="layout-header" />
    <!-- 헤더 아래 본문 (좌측 사이드바 + 우측 콘텐츠) -->
    <div class="layout-body">
      <component :is="currentSidebar" class="layout-sidebar" />

      <main class="layout-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

import CommonUserHeadBar from '@/components/common/CommonUserHeadBar.vue'
import AdminSidebar from '@/layouts/sidebar/AdminSidebar.vue'
import UserSidebar from '@/layouts/sidebar/UserSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAdmin = computed(() => {
  return authStore?.user?.role === 'ADMIN'
})

/*
  1) URL이 /admin 으로 시작하고
  2) Pinia 저장된 role이 ADMIN 일 때
  -> AdminSidebar 사용
*/
const currentSidebar = computed(() => {
  if (route.path.startsWith('/admin') && isAdmin.value) {
    return AdminSidebar
  }
  return UserSidebar
})

// 라우트 메타에 따라 관리자 / 사용자 사이드바 선택
// const currentSidebar = computed(() => {
//   return route.meta.role === 'admin' ? AdminSidebar : UserSidebar
// })
</script>

<style scoped>
/* 페이지 전체 레이아웃: 헤더 + 본문 */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 상단 헤더 높이 고정 */
.layout-header {
  flex: 0 0 56px;
}

/* 헤더 아래 본문 영역: 좌측 사이드바 + 우측 메인 */
.layout-body {
  flex: 1;
  display: flex;
  width: 100%;
  min-height: 0; /* 자식 요소에서 스크롤 가능하도록 설정 */
}

/* 좌측 사이드바 래퍼 */
.layout-sidebar {
  flex-shrink: 0;
  width: 260px;
  overflow-y: auto; /* 사이드바 내용이 길어질 때 자체 스크롤 */
}

/* 우측 메인 콘텐츠 영역 */
.layout-main {
  flex: 1;
  min-width: 0;
  background: #ffffff;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 메인 영역 스크롤 */
}
</style>
