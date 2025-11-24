<!-- src/pages/inquiry/user/InquiryDetail.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'

const route = useRoute()
const router = useRouter()
const inquiryId = Number(route.params.id)

const loading = ref(false)
const inquiry = ref({
  id: inquiryId,
  title: '',
  writerName: '',
  createdAt: '',
  question: '',
  answer: '',
})

const loadDetail = async () => {
  loading.value = true
  try {
    // TODO: API 연동
    inquiry.value = {
      id: inquiryId,
      title: '포인트 미지급 문의 입니다.',
      writerName: '운영자',
      createdAt: '2025-11-17',
      question: '문의 내용 예시입니다.',
      answer: '문의 답변 내용',
    }
  } finally {
    loading.value = false
  }
}

const goList = () => {
  router.push('/inquiries')
}

onMounted(loadDetail)
</script>

<template>
  <section class="inquiry-detail-page" v-loading="loading">
    <!-- 제목 -->
    <h2 class="detail-title">{{ inquiry.title }}</h2>

    <!-- 작성자 / 작성일 -->
    <div class="detail-meta">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">{{ inquiry.writerName }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ inquiry.createdAt }}</span>
      </div>
    </div>

    <div class="divider" />


      <!-- 답변 -->
      <!-- element plus 폼으로 감싸서 label을 위에 배치함   -->
    <el-form label-position="top" class="detail-form">
      <el-form-item label="문의 답변 내용">
        <div class="content-box content-box--large">
          <p class="content-text">
            {{ inquiry.answer }}
          </p>
        </div>
      </el-form-item>
    </el-form>

    <!-- 하단 버튼 -->
    <div class="detail-actions">
      <!-- TODO: CommonButton에서 cancel 라벨을 '이전'으로 바꾸면 Figma와 동일 -->
      <CommonButton type="cancel" @click="goList" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquiry-detail-page {
  padding: 24px 32px 40px;
}

/* 제목 */
.detail-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

/* 작성자 / 작성일 */
.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  margin-bottom: 10px;
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

/* 문의/답변 */
.detail-form {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.content-box {
  padding: 12px 16px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background: #fff;
  min-height: 120px;
}

/* 답변 박스 */
.content-box--large {

  min-height: 500px;
  width: 100%;
  display: flex;
  padding: 20px 24px;
  margin-left: auto;
  margin-right: auto;



}

.content-text {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 하단 버튼 */
.detail-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
