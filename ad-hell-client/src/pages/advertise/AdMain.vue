<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdSlotList from './AdSlotList.vue'
import PageTitle from './PageTitle.vue'

// 아이콘들 import
import IconHome from '@/assets/icon/icon-home.svg'
import IconMovie from '@/assets/icon/icon-movie.svg'
import IconGame from '@/assets/icon/icon-game.svg'
import IconShopping from '@/assets/icon/icon-shopping.svg'
import IconMusic from '@/assets/icon/icon-music.svg'
import IconSport from '@/assets/icon/icon-sports.svg'
import IconEducation from '@/assets/icon/icon-learning.svg'

const route = useRoute()

// meta.iconKey 기준으로 실제 아이콘 파일 매핑
const iconMap: Record<string, string> = {
  home: IconHome,
  movie: IconMovie,
  game: IconGame,
  shopping: IconShopping,
  music: IconMusic,
  sport: IconSport,
  education: IconEducation
}

// 페이지 제목
const pageTitle = computed(() => {
  return (route.meta.title as string) || '광고 목록'
})

// 아이콘
const pageIcon = computed(() => {
  const key = route.meta.iconKey as string | undefined
  if (!key) return IconMovie
  return iconMap[key] || IconMovie
})

// 광고 카테고리 ID (AdSlotList에 내려줌)
const categoryId = computed(() => {
  return (route.meta.categoryId as number | null) ?? null
})
</script>

<template>
  <div class="ad-main-page">
    <PageTitle
        class="page-title-margin"
        :title="pageTitle"
        :show-category="false"
        :icon-src="pageIcon"
    />
    <!-- 여기서 카테고리 ID 내려줌 -->
    <AdSlotList :category-id="categoryId" />
  </div>
</template>

<style scoped>
.ad-main-page {
}

.page-title-margin {
  margin-top: 75px;
  margin-left: 75px;
}
</style>
