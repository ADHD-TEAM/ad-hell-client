<!-- src/pages/admin/AlarmTemplateEdit.vue -->
<template>
  <div class="template-edit-page">
    <div class="edit-container">
      <header class="page-header">
        <h1>알림 템플릿 수정</h1>
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
            <el-button
                type="danger"
                class="submit-btn"
                native-type="submit"
                :loading="loading"
            >
              수정
            </el-button>
            <el-button class="cancel-btn" @click="handleCancel">
              취소
            </el-button>
          </div>
        </form>
      </section>

      <!--  수정 확인 모달 (예 / 아니오) -->
      <CommonModal
          v-model="confirmVisible"
          mode="confirm"
          message="템플릿을 수정하시겠습니까?"
          confirm-text="예"
          cancel-text="아니오"
          @confirm="confirmUpdate"
      />

      <!--  알림 모달 (확인만) -->
      <CommonModal
          v-model="alertVisible"
          mode="alert"
          :message="alertMessage"
          confirm-text="확인"
          @confirm="handleAlertConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CommonModal from '@/components/common/CommonModal.vue'
import {
  fetchAdminNotificationTemplates,
  updateAdminNotificationTemplate,
} from '@/api/notificationTemplateApi.js'

const route = useRoute()
const router = useRouter()

const templateId = Number(route.params.templateId)

const form = reactive({
  title: route.query.title || '',
  body: route.query.body || '',
})

const loading = ref(false)

//  모달 상태
const confirmVisible = ref(false)
const alertVisible = ref(false)
const alertMessage = ref('')
const alertConfirmAction = ref(null)

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

// 새로고침 등으로 쿼리 데이터가 사라진 경우 대비
const loadTemplateIfNeeded = async () => {
  if (form.title && form.body) return

  loading.value = true
  try {
    const pageData = await fetchAdminNotificationTemplates({
      page: 0,
      size: 100,
    })

    const found = pageData?.templates?.find(
        (t) => t.templateId === templateId,
    )

    if (found) {
      form.title = found.templateTitle
      form.body = found.templateBody
    }
  } catch (err) {
    console.error('템플릿 수정용 데이터 조회 실패:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplateIfNeeded)

//  바로 수정하지 않고, 먼저 확인 모달 띄우기
const handleSubmit = () => {
  if (!form.title.trim() || !form.body.trim()) {
    openAlert('제목과 내용을 모두 입력해주세요.')
    return
  }
  confirmVisible.value = true
}

// 확인 모달에서 "예" 눌렀을 때 실제 수정 호출
const confirmUpdate = async () => {
  try {
    loading.value = true

    await updateAdminNotificationTemplate(templateId, {
      templateKind: 'NORMAL',
      templateTitle: form.title.trim(),
      templateBody: form.body.trim(),
    })

    // 수정 완료 알림 → 확인 누르면 상세 페이지로 이동
    openAlert('템플릿이 수정되었습니다.', () => {
      router.push({
        name: 'AdminAlarmTemplateDetail',
        params: { templateId },
        query: {
          title: form.title,
          body: form.body,
        },
      })
    })
  } catch (err) {
    console.error(err)
    openAlert('템플릿 수정에 실패했습니다. 다시 시도해주세요.')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push({
    name: 'AdminAlarmTemplateDetail',
    params: { templateId },
  })
}
</script>

<style scoped lang="scss">
.template-edit-page {
  padding: 24px 32px 40px;
  background: #f9fbfd;
  min-height: 100%;
}

/* 가운데 최대 폭 제한 */
.edit-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 16px;

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
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

/* 버튼 영역 */
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

.submit-btn {
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
}

/* 취소 버튼은 테두리만 빨간색 */
.cancel-btn {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

@media (max-width: 1080px) {
  .template-edit-page {
    padding: 20px 16px;
  }

  .edit-container {
    max-width: 100%;
  }

  .form-card {
    padding: 18px 16px 16px;
  }
}
</style>
