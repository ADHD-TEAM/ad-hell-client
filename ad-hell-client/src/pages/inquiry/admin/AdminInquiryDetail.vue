<template>
  <section class="page">
    <!-- 제목 -->
    <header class="page-header">
      <h2 class="page-title">{{ inquiry.title }}</h2>
    </header>

    <!-- 작성자 / 작성일 -->
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">작성자 :</span>
        <span class="meta-value">{{ inquiry.writer }}</span>
      </div>
      <div class="meta-item right">
        <span class="meta-label">작성일 :</span>
        <span class="meta-value highlight">{{ inquiry.createdAt }}</span>
      </div>
    </div>

    <!-- 답변 내용 -->
    <div class="content-box">
      <div class="content-header">문의 답변 내용</div>
      <div class="content-body">
        <textarea
            class="answer-textarea"
            v-model="answer"
            placeholder="문의 답변 내용을 입력하세요."
        />
      </div>
    </div>

    <!-- 버튼 영역 -->
    <footer class="page-footer">
      <button class="btn-outline-red" @click="goBack">뒤로 가기</button>
    </footer>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 임시 데이터 – 나중에 id 기반 API 호출로 교체
const inquiryId = route.params.id

const inquiry = ref({
  id: inquiryId,
  title: '포인트 미지급 문의 입니다.',
  writer: '운영자',
  createdAt: '2025-11-17',
})

const answer = ref('') // 답변 내용 – 추후 API 연동

const goBack = () => {
  router.push('/admin/inquiries')
}
</script>

<style scoped>
.page {
  padding: 24px 32px;
}

.page-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  gap: 4px;
}

.meta-item.right {
  justify-content: flex-end;
}

.meta-label {
  color: #6b7280;
}

.meta-value {
  font-weight: 600;
}

.highlight {
  color: #ff0000;
}

.content-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 10px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
  background: #f9fafb;
}

.content-body {
  padding: 12px 16px 16px;
  flex: 1;
}

.answer-textarea {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: none;
  resize: none;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
}

.page-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.btn-outline-red {
  min-width: 96px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid #ff0000;
  background: #fff;
  color: #ff0000;
  font-size: 13px;
  cursor: pointer;
}

.btn-outline-red:hover {
  background: #fff5f5;
}
</style>
