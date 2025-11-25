<script setup>
import { useRouter } from 'vue-router'
import { useRewardList } from '@/composables/reward/useRewardList'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()

const {
  rewards,
  loading,
  error,
  currentPage,
  totalPages,
  totalItems,
  size,
  loadRewards
} = useRewardList()

const goDetail = (id) => {
  router.push(`/rewards/${id}`)
}

// 이미지 BASE 경로
const BASE_IMG_URL = import.meta.env.VITE_IMG_BASE_URL;
</script>

<template>
  <section class="reward-page">

    <h1>🎁 경품 목록</h1>

    <div v-if="loading">로딩중...</div>
    <div v-else-if="error">오류가 발생했습니다</div>

    <div v-else>

      <div class="reward-scroll-box">

        <div class="reward-grid">
          <div
              class="reward-card"
              v-for="reward in rewards"
              :key="reward.id"
              @click="goDetail(reward.id)"
          >
            <img
                class="reward-img"
                :src="BASE_IMG_URL + reward.imgName"
                :alt="reward.name"
            />

            <div class="reward-info">
              <h3>{{ reward.name }}</h3>
              <p class="point">{{ reward.pointCost }}P</p>
            </div>
          </div>
        </div>

      </div>

      <Pagination
          :page="currentPage"
          :total-pages="totalPages"
          @change-page="(p) => { currentPage = p; loadRewards() }"
      />

    </div>

  </section>
</template>

<style scoped lang="scss">

.reward-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%; /* 🔥 reward 페이지 높이 기준 */
}

.reward-scroll-box {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 220px); /* 헤더/사이드바 영향 최소화 */
  padding-right: 6px; /* 스크롤 여유 */
}

.reward-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  padding: 40px;
}

/* 카드 스타일 */
.reward-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 14px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  }
}

/* 이미지 */
.reward-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
  background: #f7f7f7;
}

.reward-info {
  text-align: center;

  h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .point {
    color: #ff3b30;
    font-weight: 600;
  }
}

/* 🔥 페이징은 고정 */
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;

  button:disabled {
    opacity: 0.5;
  }

  .page-info {
    font-weight: 600;
  }
}
</style>
