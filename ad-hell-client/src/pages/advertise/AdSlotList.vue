<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import AdSlot from '@/pages/advertise/AdSlot.vue';
import api from '@/api/api.js'; // axios 인스턴스

// ✅ 부모(메인 페이지)에서 카테고리 ID 내려받기
const props = defineProps<{
  categoryId: number | null;
}>();

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
const page = ref(1);      // 서버 규칙에 맞게 0/1 중 하나로 맞춰줘
const size = 6;
const isLoading = ref(false);
const isLastPage = ref(false);

// 무한 스크롤용 sentinel DOM
const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

/** 실제로 광고 로드 */
const loadAds = async () => {
  if (isLoading.value || isLastPage.value) return;

  isLoading.value = true;
  const categorySnapshot = props.categoryId;

  try {
    const params: Record<string, any> = {
      page: page.value,
      size
    };

    if (categorySnapshot !== null) {
      params.categoryId = categorySnapshot;
    }

    const res = await api.get<ApiResponse<AdListResponse>>('/ads', {
      params
    });

    // 요청 보내는 동안 카테고리가 바뀌었으면 무시
    if (categorySnapshot !== props.categoryId) {
      return;
    }

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

/** IntersectionObserver를 생성/재설정하는 함수 */
const setupObserver = () => {
  if (!sentinel.value) return;

  // 기존 observer 있으면 끊고 새로
  if (observer) {
    observer.disconnect();
  }

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

  observer.observe(sentinel.value);
};

// 카테고리 변경 시 리스트 리셋 + 첫 페이지부터 다시 호출
watch(
    () => props.categoryId,
    async () => {
      ads.value = [];
      page.value = 1;
      isLastPage.value = false;
      await loadAds();
      // 리스트가 바뀌면 sentinel 위치도 바뀌니까, observer도 다시 세팅
      setupObserver();
    }
);

// sentinel DOM이 실제로 생기는 순간을 감지해서 observer 붙이기
watch(
    sentinel,
    (el) => {
      if (el) {
        setupObserver();
      }
    },
    { flush: 'post' } // DOM 업데이트 이후에 실행
);

// 처음 진입 시 첫 페이지 로드만 담당
onMounted(async () => {
  await loadAds();
  // observer는 위의 watch(sentinel)에서 처리
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
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
