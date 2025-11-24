<!-- src/pages/admin/AlarmTemplateDetail.vue -->
<template>
  <div class="template-detail-page">
    <div class="detail-container">
    <!-- 제목 -->
    <header class="detail-header">
      <h1>{{ template.title || '알림 템플릿 제목' }}</h1>
    </header>

    <!-- 작성자 / 작성일 -->
    <section class="meta-bar">
      <div class="meta-left">
        <span class="meta-label">작성자:</span>
        <span class="meta-author">운영자</span>
      </div>
      <div class="meta-right" v-if="formattedCreatedAt">
        <span class="meta-label">작성일:</span>
        <span class="meta-date">{{ formattedCreatedAt }}</span>
      </div>
    </section>

    <!-- 내용 + 버튼 -->
    <section class="content-card">
      <el-input
          v-model="template.body"
          type="textarea"
          class="content-input"
          :rows="18"
          placeholder="공지사항 내용"
          readonly
      />

      <div class="button-row">
        <el-button
            type="danger"
            class="btn primary-btn"
            @click="onEdit"
        >
          수정
        </el-button>
        <el-button
            class="btn outline-btn"
            @click="onDelete"
        >
          삭제
        </el-button>
        <el-button
            class="btn outline-btn"
            @click="onCancel"
        >
          취소
        </el-button>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAdminNotificationTemplates } from '@/api/notificationTemplateApi.js'

const route = useRoute()
const router = useRouter()

const templateId = Number(route.params.templateId)

const template = reactive({
  id: templateId,
  title: route.query.title || '',
  body: route.query.body || '',
  createdAt: route.query.createdAt || '',
})

const loading = ref(false)

// 작성일: createdAt -> YYYY-MM-DD
const formattedCreatedAt = computed(() => {
  if (!template.createdAt) return ''
  const [date] = String(template.createdAt).split('T') // "2025-11-14T..." -> "2025-11-14"
  return date
})

// 새로고침 등으로 query가 비어 있을 수 있으니, 비어 있으면 목록 API에서 다시 찾아오기
const loadTemplateIfNeeded = async () => {
  if (template.title && template.body && template.createdAt) return

  loading.value = true
  try {
    const pageData = await fetchAdminNotificationTemplates({
      page: 0,
      size: 100,
    })

    const found = pageData?.templates?.find(
        (t) => t.templateId === template.id,
    )

    if (found) {
      template.title = found.templateTitle
      template.body = found.templateBody
      template.createdAt = found.createdAt
    }
  } catch (err) {
    console.error('템플릿 상세 조회 실패:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadTemplateIfNeeded)

// TODO: 이후 수정/삭제 기능 붙일 때 여기에 로직 추가
// 수정 버튼 클릭 시: 수정 페이지로 이동
const onEdit = () => {
  router.push({
    name: 'AdminAlarmTemplateEdit',
    params: { templateId: template.id },
    query: {
      title: template.title,
      body: template.body,
      createdAt: template.createdAt,
    },
  })
}

const onDelete = () => {
  console.log('삭제 클릭:', template.id)
}

const onCancel = () => {
  router.push({ name: 'AdminAlarmTemplates' })
}
</script>

<style scoped lang="scss">
.template-detail-page {
  padding: 24px 32px 40px;
  background: #f9fbfd;
  min-height: 100%;
}

.detail-container {
  max-width: 900px;   /* 여기 숫자 조절하면 폭 바뀜 (예: 960, 1024 등) */
  margin: 0 auto;
}

/* 제목 영역 */
.detail-header {
  margin-bottom: 12px;

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
  }
}

/* 작성자 / 작성일 라인 */
.meta-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 2px 10px;
  margin-bottom: 16px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #111827;
}

.meta-label {
  margin-right: 4px;
}

.meta-author,
.meta-date {
  color: #ff0000;
  font-weight: 600;
}

/* 본문 카드 */
.content-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.04);
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  min-height: 320px;
  resize: none;
}

/* 버튼 영역 */
.button-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  min-width: 72px;
  border-radius: 999px;
  font-weight: 700;
}

/* 빨간 배경 버튼 (수정) */
.primary-btn {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #ffffff;
}

/* 흰 배경 + 빨간 테두리 버튼 (삭제/취소) */
.outline-btn {
  background: #ffffff;
  color: #ff4d4f;
  border-color: #ff4d4f;
}

@media (max-width: 1080px) {
  .template-detail-page {
    padding: 20px 16px;
  }

  .content-card {
    padding: 14px 14px 16px;
  }
}
</style>
