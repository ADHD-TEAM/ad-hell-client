<!-- src/pages/inquiry/user/InquiryDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { fetchMyInquiryDetail } from '@/api/inquiryApi.js'

const route = useRoute()
const router = useRouter()
const inquiryId = Number(route.params.id)

const loading = ref(false)

// 제목/내용/답변을 그대로 보여주기 위한 상태
const inquiry = ref({
  id: inquiryId,
  title: '',
  createdAt: '',
  answeredAt: '',
  content: '',
  response: '',
})

// 상세 조회
const loadDetail = async () => {
  loading.value = true
  try {
    const res = await fetchMyInquiryDetail(inquiryId)
    const data = res.data // InquiryDetailResponse 그대로 옴

    inquiry.value = {
      id: data.id,
      title: data.title,
      createdAt: data.createdAt,
      answeredAt: data.answeredAt,
      content: data.content,   // 사용자가 작성한 내용 그대로
      response: data.response, // 관리자가 등록한 답변
    }
  } catch (e) {
    console.error('fetchMyInquiryDetail error:', e)
    // 오류 시 목록으로 복귀
    router.push({ name: 'MyInquiryList' })
  } finally {
    loading.value = false
  }
}

// 이전 버튼 → 내 문의 목록
const goBack = () => {
  router.push({ name: 'MyInquiryList' })
}

onMounted(loadDetail)
</script>

<template>
  <section class="inquiry-detail-page" v-loading="loading">
    <!-- 제목 -->
    <h3 class="inquiry-title">{{ inquiry.title }}</h3>

    <!-- 작성자 / 작성일 -->
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">회원</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ inquiry.createdAt }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 문의 내용 박스 -->
    <div class="content-box">
      <div class="box-label">문의 내용</div>
      <div class="box-body">
        <p class="content-text">
          {{ inquiry.content }}
        </p>
      </div>
    </div>

    <!-- 답변 내용 박스 (항상 박스는 보이고, 내용이 없으면 빈칸) -->
    <div class="content-box">
      <div class="box-label">답변 내용</div>
      <div class="box-body">
        <p class="content-text">
          {{ inquiry.response || '' }}
        </p>
      </div>
    </div>

    <!-- 오른쪽 하단 이전 버튼 -->
    <div class="bottom-actions">
      <CommonButton type="cancel" @click="goBack">
        이전
      </CommonButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquiry-detail-page {
  padding: 24px 32px 40px;
}

/* 상단 제목 */
.inquiry-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

/* 작성자 / 작성일 */
.meta-row {
  display: flex;
  gap: 40px;
  font-size: 13px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.meta-label {
  font-weight: 600;
}

.meta-value {
  color: #ff0000;
}

/* 상단 구분선 */
.divider {
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 8px 0 16px;
}

/* 공통 박스 스타일 (문의/답변) */
.content-box {
  border: 1px solid #efefef;
  border-radius: 10px;
  background: #ffffff;
  margin-bottom: 16px;
}

.box-label {
  font-size: 12px;
  color: #b3b3b3;
  padding: 8px 12px 0;
}

.box-body {
  padding: 8px 16px 16px;
  min-height: 180px;
}

.content-text {
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.6;
}

/* 하단 버튼 영역 */
.bottom-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
