<!-- src/pages/inquiry/admin/AdminInquiryDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import {
  fetchAdminInquiryDetail,
  answerInquiry,
} from '@/api/inquiryApi.js'

const route = useRoute()
const router = useRouter()
const inquiryId = Number(route.params.id)

const loading = ref(false)

// 문의 + 답변 데이터
const inquiry = ref({
  id: inquiryId,
  userId: null,
  title: '',
  createdAt: '',
  answeredAt: '',
  content: '',
  response: '',
})

// textarea 바인딩용
const answerText = ref('')

// 상세 조회
const loadDetail = async () => {
  loading.value = true
  try {
    const res = await fetchAdminInquiryDetail(inquiryId)
    const data = res.data // InquiryDetailResponse

    inquiry.value = {
      id: data.id,
      userId: data.userId,
      title: data.title,
      createdAt: data.createdAt,
      answeredAt: data.answeredAt,
      content: data.content,
      response: data.response,
    }

    // 이미 등록된 답변이 있으면 textarea에 채워 놓기
    answerText.value = data.response || ''
  } catch (e) {
    console.error('fetchAdminInquiryDetail error:', e)
    router.push('/admin/inquiries')
  } finally {
    loading.value = false
  }
}

// 답변 등록/수정
const saveAnswer = async () => {
  if (!answerText.value.trim()) {
    alert('답변 내용을 입력하세요.')
    return
  }

  loading.value = true
  try {
    // DTO: InquiryAnswerRequest { response }
    await answerInquiry(inquiryId, { response: answerText.value })

    alert('답변이 등록되었습니다.')
    router.push('/admin/inquiries')
  } catch (e) {
    console.error('answerInquiry error:', e)
    alert('답변 등록 중 오류가 발생했습니다.')
  } finally {
    loading.value = false
  }
}

// 취소 → 목록으로
const cancel = () => {
  router.push('/admin/inquiries')
}

onMounted(loadDetail)
</script>

<template>
  <section class="inquiry-detail-page" v-loading="loading">
    <!-- 상단 제목 -->
    <h2 class="page-title">문의</h2>

    <!-- 문의 제목 -->
    <h3 class="inquiry-title">{{ inquiry.title }}</h3>

    <!-- 작성자 / 작성일 / 답변일 -->
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">회원:</span>
        <span class="meta-value">{{ inquiry.userId }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ inquiry.createdAt }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">답변일:</span>
        <span class="meta-value">{{ inquiry.answeredAt || '-' }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <!-- 문의 내용 -->
    <div class="content-box">
      <div class="box-label">문의 내용</div>
      <div class="box-body">
        <p class="content-text">
          {{ inquiry.content }}
        </p>
      </div>
    </div>

    <!-- 답변 내용 (등록/수정용 textarea) -->
    <div class="content-box answer-box">
      <div class="box-label">답변 내용</div>
      <div class="box-body">
        <el-input
            v-model="answerText"
            type="textarea"
            :rows="8"
            placeholder="답변 내용을 입력하세요."
            class="answer-input"
        />
      </div>
    </div>

    <!-- 하단 버튼: 등록 / 취소 -->
    <div class="bottom-actions">
      <CommonButton type="register" @click="saveAnswer" />
      <CommonButton type="cancel" @click="cancel" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquiry-detail-page {
  padding: 24px 32px 40px;
}

/* 상단 제목 */
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* 문의 제목 */
.inquiry-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

/* 메타 정보 */
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

/* 구분선 */
.divider {
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 8px 0 16px;
}

/* 공통 박스 */
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

/* 답변 textarea 스타일 */
.answer-input {
  width: 100%;
}

.answer-input :deep(.el-textarea__inner) {
  border: none;
  box-shadow: none;
  resize: none;
  min-height: 180px;
}

/* 하단 버튼 정렬 */
.bottom-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
