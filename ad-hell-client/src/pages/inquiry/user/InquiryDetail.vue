<!-- src/pages/inquiry/admin/AdminInquiryDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'

const route = useRoute()
const router = useRouter()
const inquiryId = Number(route.params.id)

const loading = ref(false)

// 문의 상세 데이터 (임시 더미 데이터)
const inquiry = ref({
  id: inquiryId,
  title: '',
  memberName: '',
  createdAt: '',
  answeredAt: '',
  content: '',
})

// 답변 입력값
const answerText = ref('')

// 상세 데이터 로드 (나중에 API / store로 교체)
const loadDetail = async () => {
  loading.value = true
  try {
    inquiry.value = {
      id: inquiryId,
      title: '포인트 미지급 문의입니다.',
      memberName: 'adhell',
      createdAt: '2025-11-14',
      answeredAt: '2025-11-14',
      content: '문의 내용 예시입니다.\n실제 데이터는 API 연동 후 교체하세요.',
    }

    // ✅ 기존 예시 텍스트 설정 부분 제거
    // answerText.value = '답변 내용 예시입니다...\n...'
  } finally {
    loading.value = false
  }
}

// 등록 버튼
const saveAnswer = async () => {
  if (!answerText.value.trim()) {
    alert('답변 내용을 입력하세요.')
    return
  }

  console.log('답변 등록 요청', {
    id: inquiryId,
    answer: answerText.value,
  })

  // TODO: 나중에 updateInquiryAnswer API / store 호출
  // await inquiryStore.updateInquiryAnswer(inquiryId, { answer: answerText.value })

  alert('답변이 등록되었습니다.')
  router.push('/admin/inquiries')
}

onMounted(loadDetail)
</script>

<template>
  <section class="inquiry-detail-page" v-loading="loading">
    <!-- 페이지 타이틀 -->
    <h2 class="page-title">문의 답변 등록</h2>

    <!-- 문의 제목 -->
    <h3 class="inquiry-title">{{ inquiry.title }}</h3>

    <!-- 작성자 / 작성일 / 답변일자 -->
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">{{ inquiry.memberName }}</span>
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

    <!-- 구분선 -->
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

    <!-- ✅ 답변 내용 박스: 안쪽 박스 제거 + textarea만 -->
    <div class="content-box answer-box">
      <div class="box-label">답변 내용</div>
      <el-input
          v-model="answerText"
          type="textarea"
          :rows="8"
          placeholder="답변 내용을 입력하세요."
          class="answer-input"
      />
    </div>

    <!-- 하단 등록 버튼 -->
    <div class="bottom-actions">
      <CommonButton type="register" @click="saveAnswer" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquiry-detail-page {
  padding: 24px 32px 40px;
}

/* 상단 타이틀 */
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* 문의 제목 (굵게) */
.inquiry-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

/* 메타 정보 줄 */
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

/* 문의 내용 쪽만 안쪽 박스 유지 */
.box-body {
  padding: 8px 16px 16px;
  min-height: 180px;
}

.content-text {
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.6;
}

/* ✅ 답변 textarea 박스 패딩 */
.answer-box {
  padding: 8px 16px 16px;
}

/* 답변 textarea */
.answer-input {
  width: 100%;
  :deep(textarea) {
    resize: none;
    min-height: 180px;
  }
}

/* 하단 등록 버튼 (오른쪽) */
.bottom-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
