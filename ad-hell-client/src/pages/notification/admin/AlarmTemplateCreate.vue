<!-- src/pages/admin/AlarmTemplateCreate.vue -->
<template>
  <div class="template-create-page">
    <header class="page-header">
      <h1>알림 템플릿 등록</h1>
    </header>

    <section class="form-card">
      <form class="template-form" @submit.prevent="handleSubmit">
        <!-- 제목 -->
        <div class="form-group">
          <el-input
              v-model="form.title"
              placeholder="제목을 입력하세요."
              class="title-input"
              maxlength="200"
              show-word-limit
          />
        </div>

        <!-- 내용 -->
        <div class="form-group body-group">
          <el-input
              v-model="form.body"
              type="textarea"
              :rows="14"
              placeholder="내용을 입력하세요."
              class="body-input"
          />
        </div>

        <!-- 버튼 -->
        <div class="button-row">
          <!-- 위치 변경: 등록 왼쪽, 취소 오른쪽 -->
          <el-button
              type="danger"
              class="submit-btn"
              native-type="submit"
              :loading="loading"
          >
            등록
          </el-button>

          <el-button class="cancel-btn" @click="handleCancel">
            취소
          </el-button>
        </div>
      </form>
    </section>

    <!-- 🔔 공용 모달(alert 모드) -->
    <CommonModal
        v-model="alertVisible"
        mode="alert"
        :message="alertMessage"
        @confirm="handleAlertConfirm"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import CommonModal from '@/components/common/CommonModal.vue'
import {createAdminNotificationTemplate} from "@/api/notificationTemplateApi.js";

// 필요하면 나중에 실제 등록 API 모듈 import
// import { createAdminNotificationTemplate } from '@/api/notificationTemplateApi'

const router = useRouter()

const form = reactive({
  title: '',
  body: '',
})

const loading = ref(false)

// alert 모달 상태
const alertVisible = ref(false)
const alertMessage = ref('')
const alertConfirmAction = ref(null)

/**
 * 공용 alert 모달 열기
 * @param {string} message - 표시할 메시지
 * @param {Function|null} onConfirm - 확인 버튼 클릭 후 실행할 콜백(선택)
 */
const openAlert = (message, onConfirm = null) => {
  alertMessage.value = message
  alertConfirmAction.value = onConfirm
  alertVisible.value = true
}

const handleAlertConfirm = () => {
  if (typeof alertConfirmAction.value === 'function') {
    alertConfirmAction.value()
  }
}

const handleSubmit = async () => {
  if (!form.title.trim() || !form.body.trim()) {
    openAlert('제목과 내용을 모두 입력해주세요.')
    return
  }

  try {
    loading.value = true

    const created = await createAdminNotificationTemplate({
      templateKind: 'NORMAL',                 // 필요하면 나중에 셀렉트로 선택하게
      templateTitle: form.title.trim(),
      templateBody: form.body.trim(),
    })

    console.log('템플릿 생성 결과:', created)

    // 성공 → 모달 띄우고 확인 누르면 목록으로 이동
    openAlert('템플릿이 등록되었습니다.', () => {
      router.push({ name: 'AdminAlarmTemplates' })
    })
  } catch (e) {
    console.error(e)

    let msg = '템플릿 등록에 실패했습니다. 다시 시도해주세요.'
    if (e.response?.data?.message) {
      msg = e.response.data.message
    }

    openAlert(msg)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'AdminAlarmTemplates' })
}
</script>

<style scoped lang="scss">
.template-create-page {
  padding: 24px 32px 40px;
  background: #f9fbfd;
  min-height: 100%;
}

.page-header {
  margin-bottom: 16px;

  h1 {
    display: inline-block;
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    padding-bottom: 4px;
    border-bottom: 2px solid #111827;
  }
}

.form-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.05);
  padding: 20px 24px 18px;
}

.template-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  width: 100%;
}

.title-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  height: 44px;
}

.body-group {
  flex: 1;
}

.body-input :deep(.el-textarea__inner) {
  border-radius: 10px;
  resize: none;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.submit-btn,
.cancel-btn {
  min-width: 72px;
  border-radius: 999px;
  font-weight: 700;
}

/* 취소 버튼은 테두리만 빨간색 */
.cancel-btn {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

@media (max-width: 1080px) {
  .template-create-page {
    padding: 20px 16px;
  }

  .form-card {
    padding: 18px 16px 16px;
  }
}
</style>
