<template>
  <div class="layout">

    <!-- 🔼 공통 헤더 (항상 상단 고정) -->
    <CommonHeadBar class="layout-header" />

    <!-- 🔽 헤더 아래에서 좌우로 나뉘는 영역 -->
    <div class="layout-body">

      <!-- 🔹 왼쪽 사이드바: 관리자/유저 자동 선택 -->
      <component :is="currentSidebar" class="layout-sidebar" />

      <!-- 🔹 오른쪽 메인 컨텐츠 영역 -->
      <main class="layout-main">
        <router-view />
      </main>
    </div>

  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import CommonHeadBar from '@/components/common/CommonHeadBar.vue'
import AdminSidebar from '@/layouts/sidebar/AdminSidebar.vue'
import UserSidebar from '@/layouts/sidebar/UserSidebar.vue'

const route = useRoute()

/**
 * 🔥 rule:
 * route.meta.role === 'admin' → AdminSidebar
 * else → UserSidebar
 *
 * meta.sidebar 사용하는 것보다 더 명확해서 추천함
 */
const currentSidebar = computed(() => {
  return route.meta.role === 'admin' ? AdminSidebar : UserSidebar
})
</script>


<style scoped>
/* 전체 레이아웃: 위(헤더) + 아래(본문) */
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 헤더는 항상 위에 고정 (높이 약 56px) */
.layout-header {
  flex: 0 0 56px;
}

/* 본문: 좌측 사이드바 + 우측 콘텐츠 */
.layout-body {
  flex: 1;
  display: flex;
}

/* 좌측 사이드바 영역 */
.layout-sidebar {
  flex-shrink: 0;
}

/* 우측 페이지 영역 */
.layout-main {
  flex: 1;
  background: #ffffff;
  padding: 0;
  display: flex;
  flex-direction: column;
}
</style>
