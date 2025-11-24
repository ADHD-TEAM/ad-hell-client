<template>
  <div class="template-page">
    <div class="template-container">
    <header class="page-header">
      <h1>알림 템플릿 목록 조회</h1>
    </header>

    <section class="search-card">
      <div class="search-row">
        <label class="search-label" for="templateTitle">템플릿 제목</label>
        <el-input
            id="templateTitle"
            v-model="searchQuery"
            class="search-input"
            placeholder="예: 정기 점검"
            clearable
        />
        <el-button type="danger" class="search-button" @click="handleSearch">검색</el-button>
      </div>
    </section>

    <section class="table-card">
      <!-- 에러 메시지 -->
      <div v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </div>

      <div class="table-wrapper" v-if="!loading">
        <div class="table-head">
          <div class="col id">ID</div>
          <div class="col title">제목</div>
          <div class="col content">내용</div>
        </div>

        <div v-if="filteredTemplates.length" class="table-body">
          <div
              v-for="item in filteredTemplates"
              :key="item.id"
              class="table-row"
              @click="goDetail(item)"
          >
            <div class="col id">{{ item.id }}</div>
            <div class="col title">{{ item.title }}</div>
            <div class="col content">{{ item.body }}</div>
          </div>
        </div>
        <div v-else class="empty-state">
          검색 조건에 맞는 템플릿이 없습니다.
        </div>
      </div>

      <div v-else class="empty-state">
        템플릿 목록을 불러오는 중입니다...
      </div>

      <div class="table-footer">
        <div class="pagination" v-if="pagination.totalPages > 0">
          <button
              class="page-btn"
              :disabled="pagination.currentPage === 0"
              @click="goPage(pagination.currentPage - 1)"
          >
            이전
          </button>

          <button
              v-for="page in pagination.totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: pagination.currentPage === page - 1 }"
              @click="goPage(page - 1)"
          >
            {{ page }}
          </button>

          <button
              class="page-btn"
              :disabled="pagination.currentPage >= pagination.totalPages - 1"
              @click="goPage(pagination.currentPage + 1)"
          >
            다음
          </button>
        </div>

        <el-button type="danger" class="create-button" @click="goCreate">
          등록하기
        </el-button>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAdminNotificationTemplates } from '@/api/notificationTemplateApi.js'
import {useRouter} from "vue-router";

const router = useRouter()

const searchQuery = ref('')
const templates = ref([])

const pagination = ref({
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  size: 10,
})

const loading = ref(false)
const errorMessage = ref('')

// 템플릿 목록 불러오기
const loadTemplates = async (page = 0) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const pageData = await fetchAdminNotificationTemplates({
      keyword: searchQuery.value.trim(),
      page,
      size: pagination.value.size,
    })

    // pageData = { templates: [...], pagination: {...} }
    const p = pageData.pagination || {
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
    }

    pagination.value.currentPage = p.currentPage ?? 0
    pagination.value.totalPages = p.totalPages ?? 0
    pagination.value.totalItems = p.totalItems ?? 0

    // 백엔드 DTO -> 화면용 형태로 매핑
    templates.value = (pageData.templates || []).map((t) => ({
      id: t.templateId,
      title: t.templateTitle,
      body: t.templateBody,
      createdAt: t.createdAt,
      // kind: t.templateKind,
    }))

  } catch (err) {
    console.error(err)
    errorMessage.value = '템플릿 목록을 불러오지 못했습니다.'
    templates.value = []
  } finally {
    loading.value = false
  }
}

// 검색 버튼 -> 0페이지부터 다시 조회
const handleSearch = () => {
  loadTemplates(0)
}

// 상세 페이지로 이동
const goDetail = (item) => {
  router.push({
    name: 'AdminAlarmTemplateDetail',
    params: { templateId: item.id },
    // 리스트에서 이미 받은 데이터는 쿼리로 같이 넘겨서 재사용
    query: {
      title: item.title,
      body: item.body,
      createdAt: item.createdAt,
    },
  })
}

// 지금은 서버 페이징을 쓰니까, 프론트 필터는 단순 통과
const filteredTemplates = computed(() => templates.value)

// 페이지 이동
const goPage = (page) => {
  if (page < 0 || page >= pagination.value.totalPages) return
  loadTemplates(page)
}

// 처음 진입 시 0페이지
onMounted(() => {
  loadTemplates(0)
})

const goCreate = () => {
  // 라우트 이름으로 이동
  router.push({ name: 'AdminAlarmTemplateCreate' })
  // 또는 경로로 직접:
  // router.push('/admin/alarms/new')
}
</script>




<style scoped lang="scss">
.template-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 32px 40px;
  background: #f9fbfd;
  min-height: 100%;
}

.template-container {
  max-width: 900px;   /* 여기 숫자 조절하면 폭 바뀜 (예: 960, 1024 등) */
  margin: 0 auto;
}

.page-header {
  padding: 0 0 8px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
  }
}

.search-card,
.table-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.04);
}

.search-card {
  padding: 18px 20px;
}

.search-row {
  display: grid;
  grid-template-columns: 140px 1fr 120px;
  gap: 12px;
  align-items: center;
}

.search-label {
  font-weight: 700;
  font-size: 15px;
  color: #111827;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  height: 42px;
}

.search-button {
  height: 42px;
  border-radius: 10px;
  font-weight: 700;
}

.table-card {
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 120px 220px 1fr;
  align-items: center;
}

.table-head {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 700;
  color: #111827;
  height: 52px;
}

.table-row {
  min-height: 56px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-weight: 600;
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  padding: 0 16px;
  display: flex;
  align-items: center;
}

.col.title,
.col.content {
  word-break: keep-all;
}

.empty-state {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
  font-weight: 600;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  min-width: 40px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #4b5563;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #d32f2f;
}

.page-btn:disabled {
  cursor: not-allowed;
  color: #d1d5db;
}

.page-btn.active {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #ffffff;
}

.create-button {
  border-radius: 10px;
  font-weight: 700;
  padding: 0 18px;
  height: 40px;
}

@media (max-width: 1080px) {
  .template-page {
    padding: 20px 16px;
  }

  .search-row {
    grid-template-columns: 1fr;
  }

  .table-head,
  .table-row {
    grid-template-columns: 100px 180px 1fr;
  }
}

.error-text {
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 8px;
}

.table-row {
  cursor: pointer;
}

.table-row:hover {
  background: #fff5f5;
}

</style>