<!-- src/components/ad/AdSlot.vue -->
<script setup lang="ts">
import { RouterLink } from 'vue-router';

const props = defineProps<{
  id: string;
  title: string;      // 광고 제목
  category: string;   // 카테고리 이름
  videoSrc: string;   // 동영상 파일 경로나 URL
}>();
</script>

<template>
  <RouterLink
      class="ad-slot"
      :to="{ name: 'AdDetail', params: { id: props.id } }"
  >
    <div class="ad-card">
      <!-- 동영상 영역 -->
      <div class="ad-card__media">
        <video
            class="ad-card__video"
            :src="videoSrc"
            controls
        />
      </div>

      <div class="ad-card__info">
        <!-- 제목 -->
        <p class="ad-card__title">
          {{ title }}
        </p>

        <!-- 카테고리 -->
        <p class="ad-card__category">
          {{ category }}
        </p>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.ad-slot {
  display: block;
  width: 260px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  font-family: inherit;
}

.ad-card {
  width: 220px;
  cursor: pointer;
  font-family: inherit;
}

/* 위쪽 동영상 영역 */
.ad-card__media {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #f2f2f2;
  overflow: hidden;
  border-radius: 8px;
}

.ad-card__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 아래쪽 텍스트 영역 */
.ad-card__info {
  margin-top: 8px;
}

.ad-card__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px;
  line-height: 1.3;
}

.ad-card__category {
  font-size: 12px;
  color: #606060;
  margin: 0;
}
</style>
