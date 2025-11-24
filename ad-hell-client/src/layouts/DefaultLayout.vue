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

import CommonUserHeadBar from '@/components/common/HeadBar/CommonUserHeadBar.vue'
import AdminSidebar from '@/layouts/sidebar/AdminSidebar.vue'
import UserSidebar from '@/layouts/sidebar/UserSidebar.vue'

const route = useRoute()

const currentSidebar = computed(() => {
  return route.meta.role === 'admin' ? AdminSidebar : UserSidebar
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-header {
  flex: 0 0 56px;
}

.layout-body {
  flex: 1;
  display: flex;
  width: 100%;
  height: calc(100vh - 56px);
}

.layout-sidebar {
  flex-shrink: 0;
  width: 260px;
  height: 100%;
}

.layout-main {
  flex: 1;
  background: #ffffff;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>