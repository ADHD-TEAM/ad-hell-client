<!-- src/pages/inquiry/user/InquiryCreate.vue -->
<script setup>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import { createInquiry } from '@/api/inquiryApi.js'
import { useAuthStore } from '@/stores/authStore.js'

const router = useRouter()
const authStore = useAuthStore()

// 작성자 표시용
const writerName = computed(() => {
  return authStore.userInfo?.nickname
      || authStore.userInfo?.username
      || '회원'
})

// 오늘 날짜
const today = new Date().toISOString().slice(0, 10)

// 문의 작성 폼
const form = reactive({
  title: '',
  content: '',
  categoryId: null,
})

const onSubmit = async () => {
  if (!form.title.trim() || !form.content.trim()) {
    alert('제목과 내용을 입력하세요.')
    return
  }
  if (!form.categoryId) {
    alert('문의 유형(카테고리 ID)를 입력하세요.')
    return
  }

  try {
    const payload = {
      title: form.title,
      content: form.content,
      categoryId: form.categoryId,
    }

    await createInquiry(payload)

    alert('문의가 등록되었습니다.')
    router.push({ name: 'MyInquiryList' })
  } catch (e) {
    console.error('createInquiry error:', e.response?.data || e)
    alert('문의 등록 중 오류가 발생했습니다.')
  }
}

const onCancel = () => {
  router.push({ name: 'MyInquiryList' })
}
</script>

<template>
  <section class="inquiry-create-page">
    <!-- 제목 입력 -->
    <div class="title-row">
      <el-input
          v-model="form.title"
          placeholder="제목을 입력하세요."
          class="title-input"
          maxlength="100"
          show-word-limit
      />
    </div>

    <!-- 작성자 / 작성일 -->
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">작성자:</span>
        <span class="meta-value">{{ writerName }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">작성일:</span>
        <span class="meta-value">{{ today }}</span>
      </div>
    </div>

    <!-- 카테고리 ID (게시판과 순서 통일: 제목 아래, 내용 위) -->
    <div class="category-row">
      <el-form label-position="top" class="category-form">
        <el-form-item label="카테고리 ID">
          <el-input-number
              v-model="form.categoryId"
              :min="1"
              placeholder="카테고리 ID를 입력하세요."
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 구분선 -->
    <div class="divider"></div>

    <!-- 문의 내용 박스 (바깥 박스만 유지) -->
    <div class="content-box">
      <div class="box-label">문의 내용</div>
      <el-input
          v-model="form.content"
          type="textarea"
          placeholder="문의 내용을 입력하세요."
          :rows="14"
          class="content-textarea direct-textarea"
      />
    </div>

    <!-- 하단 버튼 -->
    <div class="bottom-actions">
      <CommonButton type="register" @click="onSubmit" />
      <CommonButton type="cancel" @click="onCancel" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.inquiry-create-page {
  padding: 24px 32px 40px;
}

/* 제목 입력 줄 */
.title-row {
  margin-bottom: 8px;
}

.title-input {
  :deep(.el-input__wrapper) {
    border-radius: 0;
    border-bottom: 1px solid #e5e5e5;
    box-shadow: none;
  }
  :deep(input) {
    font-size: 20px;
    font-weight: 700;
  }
}

/* 작성자 / 작성일 */
.meta-row {
  display: flex;
  gap: 40px;
  font-size: 13px;
  margin-bottom: 12px;
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

/* 카테고리 영역 */
.category-row {
  margin-bottom: 8px;
}

.category-form {
  max-width: 260px;
}

/* 구분선 */
.divider {
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 8px 0 16px;
}

/* 문의 내용 박스: 바깥 박스만 */
.content-box {
  border: 1px solid #efefef;
  border-radius: 10px;
  background: #ffffff;
  margin-bottom: 16px;
  padding: 8px 16px 16px;
}

.box-label {
  font-size: 12px;
  color: #b3b3b3;
  padding-bottom: 6px;
}

/* textarea 스타일 */
.direct-textarea {
  width: 100%;
}

.direct-textarea :deep(textarea) {
  resize: none;
  min-height: 260px;
  font-size: 13px;
  line-height: 1.6;
}

/* 하단 버튼 */
.bottom-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
