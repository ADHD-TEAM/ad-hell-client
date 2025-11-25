<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AdSlot from '@/pages/advertise/AdSlot.vue';
import api from '@/api/api.js'; // axios 인스턴스 (baseURL 설정되어 있다고 가정)

interface AdItem {
  id: string;
  title: string;
  category: string;
  videoSrc: string; // 백엔드에서 주는 동영상 URL
}

// 광고 리스트
const ads = ref<AdItem[]>([]);

// 페이지네이션 상태
const page = ref(0);      // 현재 페이지 (0부터 시작)
const size = 6;           // 한 번에 몇 개씩 가져올지
const isLoading = ref(false);
const isLastPage = ref(false);

// 무한 스크롤용 sentinel DOM
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// 광고 가져오는 함수
const loadAds = async () => {
  if (isLoading.value || isLastPage.value) return;

  isLoading.value = true;
  try {
    const res = await api.get('/ads', {
      params: { page: page.value, size }
    });

    // 백엔드가 Page<AdResponse> 형식(Sprint Data)이라면:
    const content: AdItem[] = res.data.content ?? [];
    ads.value.push(...content);

    // 마지막 페이지 판별
    if (res.data.last === true || content.length < size) {
      isLastPage.value = true;
    } else {
      page.value += 1;
    }
  } catch (e) {
    console.error('광고 로드 실패:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // 첫 페이지 로드
  loadAds();

  // IntersectionObserver 생성
  observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // sentinel이 화면에 보이면 다음 페이지 로드
          loadAds();
        }
      },
      {
        root: null,              // 현재 뷰포트 기준
        rootMargin: '0px 0px 200px 0px', // 바닥에서 200px 남았을 때 미리 로드
        threshold: 0
      }
  );

  if (sentinel.value && observer) {
    observer.observe(sentinel.value);
  }
});

onBeforeUnmount(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value);
  }
  observer = null;
});
</script>

<template>
  <main class="ad-main">
    <!-- 중앙 제목: 광고 목록 (이건 PageTitle에서 이미 하니까 지워도 됨) -->
    <!-- <h2 class="ad-main__title">광고 목록</h2> -->

    <section class="ad-main__section">
      <h3 class="ad-main__section-label">오늘</h3>

      <!-- 카드 그리드 -->
      <div class="ad-main__grid">
        <AdSlot
            v-for="ad in ads"
            :key="ad.id"
            :id="ad.id"
            :title="ad.title"
            :category="ad.category"
            :video-src="ad.videoSrc"
        />
      </div>

      <!-- 무한 스크롤용 sentinel -->
      <div ref="sentinel" class="ad-main__sentinel"></div>

      <!-- 로딩 상태 표시 -->
      <p v-if="isLoading" class="ad-main__loading">불러오는 중...</p>
      <p v-if="isLastPage" class="ad-main__end">마지막 광고까지 다 봤어요.</p>
    </section>
  </main>
</template>

<style scoped>
.ad-main {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 16px;
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

/* 카드 그리드 */
.ad-main__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

/* sentinel은 눈에 안 보이게 해도 되고, 높이만 조금 줘도 됨 */
.ad-main__sentinel {
  height: 1px;
}

.ad-main__loading,
.ad-main__end {
  text-align: center;
  margin: 16px 0;
  font-size: 14px;
}
</style>
