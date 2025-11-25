<script setup lang="ts">
import AdSlot from '@/pages/advertise/AdSlot.vue';

interface AdItem {
  id: string;
  title: string;
  category: string;
  videoSrc: string;
}

// 오늘 올라온 광고 더미 데이터 (나중에 API 연동)
const todayAds: AdItem[] = [
  {
    id: '1',
    title: '동원참치가 좋아요1',
    category: '식품 · 참치캔',
    videoSrc: '/videos/sample1.mp4',
  },
  {
    id: '2',
    title: '동원참치가 좋아요2',
    category: '식품 · 참치캔',
    videoSrc: '/videos/sample2.mp4',
  },
  {
    id: '3',
    title: '동원참치가 좋아요3',
    category: '식품 · 참치캔',
    videoSrc: '/videos/sample3.mp4',
  },
  {
    id: '4',
    title: '동원참치가 좋아요1',
    category: '식품 · 참치캔',
    videoSrc: '/videos/sample1.mp4',
  },
  {
    id: '5',
    title: '동원참치가 좋아요2',
    category: '식품 · 참치캔',
    videoSrc: '/videos/sample2.mp4',
  },
  {
    id: '6',
    title: '동원참치가 좋아요3',
    category: '식품 · 참치캔',
    videoSrc: '/videos/sample3.mp4',
  },
];
</script>

<template>
  <main class="ad-main">
    <!-- 중앙 제목: 광고 목록 -->
    <h2 class="ad-main__title">광고 목록</h2>

    <section class="ad-main__section">
      <!-- 왼쪽 섹션 제목: 오늘 -->
      <h3 class="ad-main__section-label">오늘</h3>

      <!-- 카드 그리드 -->
      <div class="ad-main__grid">
        <AdSlot
            v-for="ad in todayAds"
            :key="ad.id"
            :id="ad.id"
            :title="ad.title"
            :category="ad.category"
            :video-src="ad.videoSrc"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.ad-main {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 16px;
}

.ad-main__title {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 32px;
}

.ad-main__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ad-main__section-label {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
}

/* 카드 그리드: 3열 × 2행 느낌 */
.ad-main__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
</style>
