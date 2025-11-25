<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useRewardDetail } from '@/composables/reward/useRewardDetail'
import CommonButton from '@/components/common/CommonButton.vue'
import CommonModal from '@/components/common/CommonModal.vue'
import { exchangeReward } from '@/api/rewardApi'

const route = useRoute()
const router = useRouter()

const id = route.params.id

const {
  reward,
  loading,
  error,
} = useRewardDetail(id)

const goBack = () => router.back()

// 이미지 경로
const BASE_IMG_URL = import.meta.env.VITE_IMG_BASE_URL

const showModal = ref(false)
const alertModal = ref(false)
const alertMessage = ref("")

// 모달 열기 (항상 열림)
const openExchangeModal = () => {
  showModal.value = true
}

const onConfirmExchange = async () => {

  if (reward.value.stock === 0) {
    alertMessage.value = "재고가 부족하여 교환할 수 없습니다."
    alertModal.value = true
    return
  }

  // 정상 API 호출
  try {
    await exchangeReward(id)
    alertMessage.value = "교환이 완료되었습니다!"
    alertModal.value = true
  } catch (err) {
    alertMessage.value = "교환 실패: 포인트 부족 또는 서버 오류"
    alertModal.value = true
  }
}

</script>

<template>
  <section class="reward-detail-page">

    <!-- 🔙 뒤로가기 아이콘 버튼 -->
    <button class="back-btn" @click="goBack">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 6L9 12L15 18" stroke="#333" stroke-width="2" stroke-linecap="round"/>
      </svg>
      뒤로가기
    </button>

    <div v-if="loading" class="center">로딩 중...</div>
    <div v-else-if="error" class="center">오류 발생</div>

    <div v-else-if="reward" class="detail-container">

      <img
          class="reward-img"
          :src="BASE_IMG_URL + reward.imgName"
          :alt="reward.name"
      />

      <div class="info-box">
        <h1 class="title">{{ reward.name }}</h1>

        <p class="point">필요 포인트: <strong>{{ reward.pointCost }}</strong>P</p>
        <p class="stock">재고: <strong>{{ reward.stock }}</strong> 개</p>
        <p class="category">카테고리: <strong>{{ reward.category.categoryName }}</strong></p>
        <p class="desc">{{ reward.description }}</p>

        <div class="action-box">
          <CommonButton
              type="change"
              width="180px"
              height="46px"
              @click="openExchangeModal"
          />
        </div>
      </div>

    </div>

    <CommonModal
        v-model="showModal"
        mode="confirm"
        message="정말로 이 경품을 교환하시겠습니까?"
        confirmText="교환"
        cancelText="취소"
        @confirm="onConfirmExchange"
    />

    <CommonModal
        v-model="alertModal"
        mode="alert"
        :message="alertMessage"
        confirmText="확인"
    />
  </section>
</template>

<style scoped lang="scss">
.reward-detail-page {
  padding: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
  padding: 4px 0;

  &:hover {
    opacity: 0.7;
  }
}

/* 로딩/에러 */
.center {
  text-align: center;
  margin-top: 40px;
}

/* 중앙 정렬: 이미지 위, 정보는 아래 */
.detail-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

/* 이미지 크게 */
.reward-img {
  width: 360px;
  height: 360px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #eee;
}

/* 텍스트 박스 */
.info-box {
  width: 100%;
  max-width: 600px;
  text-align: center;

  .title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 10px;
  }

  .desc {
    margin-top: 16px;
    line-height: 1.6;
    color: #555;
  }
}

/* 버튼 가운데 */
.action-box {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>
