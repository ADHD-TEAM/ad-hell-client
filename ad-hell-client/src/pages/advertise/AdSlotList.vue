<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import AdSlot from '@/pages/advertise/AdSlot.vue';
import api from '@/api/api.js'; // axios 인스턴스

interface AdFileDto {
  fileId: number;
  originFileName: string;
  storedName: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'VIDEO' | 'DOC' | string;
}

interface AdDto {
  adId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  files: AdFileDto[];
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface AdListResponse {
  ads: AdDto[];
  pagination: Pagination;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  errorCode: string | null;
  message: string | null;
  timestamp: string;
}

interface AdItem {
  id: number;
  title: string;
  category: string;
  videoSrc: string;
}

// 광고 리스트
const ads = ref<AdItem[]>([]);

// 페이지네이션 상태
const page = ref(1);      // 현재 페이지 (0부터 시작)
const size = 6;           // 한 번에 몇 개씩 가져올지
const isLoading = ref(false);
const isLastPage = ref(false);

// 무한 스크롤용 sentinel DOM
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const loadAds = async () => {
  if (isLoading.value || isLastPage.value) return;

  isLoading.value = true;
  try {
    const res = await api.get<ApiResponse<AdListResponse>>('/ads', {
      params: { page: page.value, size }
    });

    const listResponse = res.data?.data;
    if (!listResponse) {
      console.error('응답에 data가 없습니다.', res.data);
      return;
    }

    const content = listResponse.ads ?? [];

    const mapped: AdItem[] = content.map((ad: AdDto) => {
      const videoFile = (ad.files ?? []).find(
          (file) => file.fileType === 'VIDEO'
      );

      return {
        id: ad.adId,
        title: ad.title,
        category: ad.categoryName,
        videoSrc: videoFile?.fileUrl ?? ''
      };
    });

    ads.value.push(...mapped);

    // 👉 pagination 쓰면 더 좋지만, 일단 content 기준으로 유지
    if (content.length < size) {
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

// 🔥 onMounted를 async로 바꾼다
onMounted(async () => {
  // 1) 첫 페이지를 다 불러오고
  await loadAds();

  // 2) 그 다음에 Observer를 단다
  observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadAds();
        }
      },
      {
        root: null,
        rootMargin: '0px 0px 200px 0px',
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
