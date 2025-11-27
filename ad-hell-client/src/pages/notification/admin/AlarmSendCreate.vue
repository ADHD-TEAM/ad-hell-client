<!-- src/pages/notification/admin/AlarmSendCreate.vue -->
<template>
  <div class="send-create-page">
    <div class="send-create-container">
      <!-- 제목 -->
      <header class="page-header">
        <h1>알림 발송</h1>
      </header>

      <section class="form-card">
        <!-- 1. 종류 선택 -->
        <div class="form-row">
          <div class="field-label">종류</div>
          <div class="field-main">
            <el-radio-group v-model="sendMode" class="inline-radios">
              <el-radio :label="'TEMPLATE'">템플릿</el-radio>
              <el-radio :label="'EVENT'">이벤트</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 1-1. 발송 대상 선택 -->
        <div class="form-row">
          <div class="field-label">대상</div>
          <div class="field-main">
            <el-radio-group v-model="targetStatus" class="inline-radios">
              <el-radio label="ALL">전체</el-radio>
              <el-radio label="PUSH_ENABLED">push on 대상</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 2. 예약 시간 / 즉시 · 예약 -->
        <div class="form-row">
          <div class="field-label">예약 시간</div>
          <div class="field-main">
            <el-radio-group v-model="scheduleMode" class="inline-radios">
              <el-radio :label="'IMMEDIATE'">즉시</el-radio>
              <el-radio :label="'RESERVE'">예약</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 3. 예약 일시 (즉시일 땐 비활성화) -->
        <div class="form-row">
          <div class="field-label">예약 일시</div>
          <div class="field-main">
            <el-date-picker
                v-model="reservedAt"
                type="datetime"
                value-format="YYYY-MM-DDTHH:mm:ss"
                placeholder="연도-월-일  --:--:--"
                class="datetime-input"
                :disabled="scheduleMode === 'IMMEDIATE'"
            />
          </div>
        </div>

        <!-- 4-A. 템플릿 발송 모드 -->
        <template v-if="isTemplateMode">
          <div class="form-row">
            <div class="field-label">발송 템플릿</div>
            <div class="field-main">
              <el-select
                  v-model="selectedTemplateId"
                  placeholder="템플릿을 선택하세요."
                  class="template-select"
                  :loading="loadingTemplates"
                  clearable
              >
                <el-option
                    v-for="t in templateOptions"
                    :key="t.id"
                    :label="t.title"
                    :value="t.id"
                />
              </el-select>
            </div>
          </div>
        </template>

        <!-- 4-B. 이벤트 발송 모드 -->
        <template v-else>
          <div class="form-row">
            <div class="field-label">이벤트 발송</div>
            <div class="field-main">
              <el-input
                  v-model="eventTitle"
                  placeholder="이벤트 제목"
                  class="event-title-input"
              />
            </div>
          </div>

          <div class="form-row form-row--textarea">
            <div class="field-label"></div>
            <div class="field-main">
              <el-input
                  v-model="eventBody"
                  type="textarea"
                  :rows="10"
                  placeholder="내용"
                  class="event-body-input"
              />
            </div>
          </div>
        </template>

        <!-- 하단 버튼 -->
        <div class="button-row">
          <el-button
              type="danger"
              class="btn primary-btn"
              :loading="sending"
              @click="handleSubmit"
          >
            발송
          </el-button>
          <el-button
              class="btn outline-btn"
              @click="handleCancel"
          >
            취소
          </el-button>
        </div>
      </section>

      <!-- 알림 모달 -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import CommonModal from '@/components/common/CommonModal.vue'

import {
  fetchAdminNotificationTemplates,
} from '@/api/notificationApi.js'
import {
  sendAdminNotificationNow,
  reserveAdminNotification,
} from '@/api/notificationApi.js'
import { createAdminNotificationTemplate } from '@/api/notificationApi.js'

const router = useRouter()

// ===== 상태 =====
const sendMode = ref('TEMPLATE')          // 'TEMPLATE' | 'EVENT'
const scheduleMode = ref('IMMEDIATE')     // 'IMMEDIATE' | 'RESERVE'
const targetStatus = ref('ALL')

const reservedAt = ref(null)              // 예약 일시 (YYYY-MM-DDTHH:mm:ss)

// 템플릿 모드용
const templateOptions = ref([])           // { id, title }[]
const selectedTemplateId = ref(null)
const loadingTemplates = ref(false)

// 이벤트 모드용
const eventTitle = ref('')
const eventBody = ref('')

const sending = ref(false)

// 모달 상태 (alert 용)
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

// 파생 상태
const isTemplateMode = computed(() => sendMode.value === 'TEMPLATE')

// 모드 전환 시 필요없는 값 정리
watch(sendMode, (mode) => {
  if (mode === 'TEMPLATE') {
    eventTitle.value = ''
    eventBody.value = ''
  } else {
    selectedTemplateId.value = null
  }
})

watch(scheduleMode, (v) => {
  if (v === 'IMMEDIATE') {
    reservedAt.value = null
  }
})

// ===== 템플릿 목록 로드 =====
const loadTemplates = async () => {
  if (!isTemplateMode.value) return

  loadingTemplates.value = true
  try {
    const pageData = await fetchAdminNotificationTemplates({
      page: 0,
      size: 100,
    })

    templateOptions.value = (pageData.templates || []).map((t) => ({
      id: t.templateId,
      title: t.templateTitle,
    }))
  } catch (err) {
    console.error('템플릿 목록 조회 실패:', err)
    openAlert('템플릿 목록을 불러오지 못했습니다.')
  } finally {
    loadingTemplates.value = false
  }
}

onMounted(() => {
  loadTemplates()
})

// ===== 유효성 검사 & 발송 처리 =====
const handleSubmit = async () => {
  // 예약 발송인 경우: 예약 일시 필수
  if (scheduleMode.value === 'RESERVE' && !reservedAt.value) {
    openAlert('예약 발송을 선택하셨다면 예약 일시를 지정해주세요.')
    return
  }

  const isImmediate = scheduleMode.value === 'IMMEDIATE'

  // === 1) 템플릿 모드 ===
  if (isTemplateMode.value) {
    if (!selectedTemplateId.value) {
      openAlert('발송할 템플릿을 선택해주세요.')
      return
    }

    const baseSendReq = {
      targetStatus: targetStatus.value,     // 전체 발송
      targetMemberIds: null,
      variables: {},           // 템플릿 치환 변수 사용 시 채우기
    }

    try {
      sending.value = true

      if (isImmediate) {
        await sendAdminNotificationNow(selectedTemplateId.value, baseSendReq)
        openAlert('알림이 즉시 발송되었습니다.', () => {
          router.push({ name: 'AdminAlarmSendList' })
        })
      } else {
        const reserveReq = {
          scheduledAt: reservedAt.value,
          targetStatus: targetStatus.value,
          targetMemberIds: null,
          variables: {},
        }
        await reserveAdminNotification(selectedTemplateId.value, reserveReq)
        openAlert('알림 예약이 등록되었습니다.', () => {
          router.push({ name: 'AdminAlarmSendList' })
        })
      }
    } catch (err) {
      console.error(err)
      openAlert('알림 발송 처리 중 오류가 발생했습니다.')
    } finally {
      sending.value = false
    }

    return
  }

  // === 2) 이벤트 모드 ===
  if (!eventTitle.value.trim() || !eventBody.value.trim()) {
    openAlert('이벤트 제목과 내용을 모두 입력해주세요.')
    return
  }

  try {
    sending.value = true

    // 1) EVENT 템플릿 생성
    const newTemplate = await createAdminNotificationTemplate({
      templateKind: 'EVENT',
      templateTitle: eventTitle.value.trim(),
      templateBody: eventBody.value.trim(),
    })
    const templateId = newTemplate.templateId

    const baseSendReq = {
      targetStatus: targetStatus.value,
      targetMemberIds: null,
      variables: {},
    }

    if (isImmediate) {
      await sendAdminNotificationNow(templateId, baseSendReq)
      openAlert('이벤트 알림이 발송되었습니다.', () => {
        router.push({ name: 'AdminAlarmSendList' })
      })
    } else {
      const reserveReq = {
        scheduledAt: reservedAt.value,
        targetStatus: targetStatus.value,
        targetMemberIds: null,
        variables: {},
      }
      await reserveAdminNotification(templateId, reserveReq)
      openAlert('이벤트 알림 예약이 등록되었습니다.', () => {
        router.push({ name: 'AdminAlarmSendList' })
      })
    }
  } catch (err) {
    console.error(err)
    openAlert('이벤트 알림 발송 중 오류가 발생했습니다.')
  } finally {
    sending.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'AdminAlarmSendList' })
}
</script>

<style scoped lang="scss">
.send-create-page {
  padding: 24px 32px 40px;
  background: #f9fbfd;
  min-height: 100%;
}

.send-create-container {
  max-width: 720px;
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
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.04);
  padding: 18px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  column-gap: 16px;
  align-items: center;

  &--textarea {
    align-items: flex-start;
  }
}

.field-label {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  padding-top: 2px;
}

.field-main {
  width: 100%;
}

.inline-radios :deep(.el-radio) {
  margin-right: 24px;
}

/* 입력 스타일 */
.event-title-input :deep(.el-input__wrapper),
.datetime-input :deep(.el-input__wrapper),
.template-select :deep(.el-input__wrapper) {
  border-radius: 8px;
  height: 38px;
}

.event-body-input :deep(.el-textarea__inner) {
  border-radius: 10px;
  resize: none;
}

/* 버튼 영역 */
.button-row {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  min-width: 72px;
  border-radius: 999px;
  font-weight: 700;
}

/* 발송 버튼: 진한 빨강 */
.primary-btn {
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
}

/* 취소 버튼: 흰 배경 + 빨강 테두리 */
.outline-btn {
  background: #ffffff;
  color: #ff0000;
  border-color: #ff0000;
}

@media (max-width: 1080px) {
  .send-create-page {
    padding: 20px 16px;
  }

  .send-create-container {
    max-width: 100%;
  }

  .form-card {
    padding: 16px 14px 18px;
  }
}
</style>
