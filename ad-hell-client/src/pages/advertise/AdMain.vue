<script setup lang="ts">
import AdSlotList from './AdSlotList.vue'
import PageTitle from './PageTitle.vue'
import IconSrc from '@/assets/icon/icon-movie.svg'
</script>

<template>
  <div class="ad-main-page">
    <PageTitle
        class="page-title-margin"
        title="광고 목록"
        :show-category="false"
        :icon-src="IconSrc"
    />
    <AdSlotList />
  </div>
</template>

<style scoped>
/* 전체 페이지 래퍼 (원하면 여기서도 패딩/마진 조절 가능) */
.ad-main-page {
  /* 필요하면 여기에 기본 레이아웃 옵션 추가 */
}

/* 제목을 위/왼쪽에서 50px 떨어뜨리기 */
.page-title-margin {
  margin-top: 75px;
  margin-left: 75px;
}
</style>
