<!-- src/pages/inquiry/admin/AdminInquiryDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { useInquiryStore } from '@/stores/inquiryStore.js'

const route = useRoute()
const router = useRouter()
const inquiryStore = useInquiryStore()

const inquiryId = Number(route.params.id)

const loading = ref(false)

const inquiry = ref({
  id: inquiryId,
  title: '',
  memberName: '',
  createdAt: '',
  answeredAt: '',
  content: '',
})

const answerText = ref('')

const loadDetail = async () => {
  loading.value = true
  try {
    const data = await inquiryStore.fetchAdminInquiryDetail(inquiryId)

    inquiry.value = {
      id: data.id,
      title: data.title,
      memberName: data.memberName,
      createdAt: data.createdAt,
      answeredAt: data.answeredAt,
      content: data.content,
    }

    answerText.value = data.answer || ''
  } finally {
    loading.value = false
  }
}

const saveAnswer = async () => {
  if (!answerText.value.trim()) {
    alert('답변 내용을 입력하세요.')
    return
  }

  loading.value = true
  try {
    await inquiryStore.updateAdminInquiryAnswer(inquiryId, {
      answer: answerText.value,
    })

    alert('답변이 등록되었습니다.')
    router.push('/admin/inquiries')
  } finally {
    loading.value = false
  }
}

onMounted(loadDetail)
</script>

<template>
  <section class="inquiry-detail-page" v-loading="loading">
    <h2 class="page-title">문의 답변 등록</h2>

    <h3 class="inquiry-title">{{ inquiry.title }}</h3>

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

    <div class="divider"></div>

    <div class="content-box">
      <div class="box-label">문의 내용</div>
      <div class="box-body">
        <p class="content-text">
          {{ inquiry.content }}
        </p>
      </div>
    </div>

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

    <div class="bottom-actions">
      <CommonButton type="register" @click="saveAnswer" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquiry-detail-page {
  padding: 24px 32px 40px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.inquiry-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

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

.divider {
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 8px 0 16px;
}

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

.answer-input {
  width: 100%;
  :deep(.el-textarea__inner) {
    border: none;
    box-shadow: none;
    resize: none;
    min-height: 180px;
  }
}

.bottom-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
