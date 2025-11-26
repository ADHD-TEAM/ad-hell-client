<!-- src/pages/admin/AlarmSendList.vue -->
<template>
  <div class="send-list-page">
    <div class="send-list-container">
      <!-- 제목 -->
      <header class="page-header">
        <h1>알림 목록 조회</h1>
      </header>

      <!-- 검색 영역 -->
      <section class="search-card">
        <!-- 키워드(제목 검색) 행 -->
        <div class="search-row search-row--keyword">
          <div class="field-label">키워드</div>
          <div class="field-main">
            <el-input
                v-model="keyword"
                placeholder="알림 제목 검색"
                class="keyword-input"
                clearable
            />
          </div>
          <CommonButton
              type="search"
              :width="64"
              :height="36"
              @click="handleSearch"
          />
        </div>

        <!-- 발송 일시 행 -->
        <div class="search-row search-row--date">
          <div class="field-label">발송 일시</div>
          <div class="field-main date-range">
            <el-date-picker
                v-model="startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="연도-월-일 - - :- -"
                class="date-input"
            />
            <span class="tilde">~</span>
            <el-date-picker
                v-model="endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="연도-월-일 - - :- -"
                class="date-input"
            />
          </div>
        </div>
      </section>

      <!-- 목록 테이블 -->
      <section class="table-card">
        <div v-if="errorMessage" class="error-text">
          {{ errorMessage }}
        </div>

        <div v-if="!loading" class="table-wrapper">
          <!-- 헤더 -->
          <div class="table-head">
            <div class="col id">ID</div>
            <div class="col title">제목</div>
            <div class="col target">대상</div>
            <div class="col body">내용</div>
            <div class="col status">상태</div>
            <div class="col created-at">발송 일시</div>
          </div>

          <!-- 데이터 -->
          <div v-if="displayNotifications.length" class="table-body">
            <div
                v-for="item in displayNotifications"
                :key="item.id"
                class="table-row"
            >
              <div class="col id">{{ item.id }}</div>
              <div class="col title">{{ item.title }}</div>
              <div class="col target">
                {{ item.userId == null ? '전체' : '개인' }}
              </div>
              <div class="col body">
                {{ item.body }}
              </div>
              <div class="col status">
  <span
      class="status-pill"
      :class="item.sent ? 'status-success' : 'status-pending'"
  >
    <span class="dot" />
    <span>{{ item.sent ? '발송완료' : '발송대기' }}</span>
  </span>
              </div>
              <div class="col created-at">
                {{ formatDateTime(item.createdAt) }}
              </div>
            </div>
          </div>

          <!-- 비어 있을 때 -->
          <div v-else class="empty-state">
            조회된 알림이 없습니다.
          </div>
        </div>

        <div v-else class="empty-state">
          알림 목록을 불러오는 중입니다...
        </div>

        <!-- 하단: 페이지네이션 / 발송 등록 버튼 -->
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

          <!-- 오른쪽: 알림 발송 등록 -->
          <CommonButton
              type="register"
              :width="100"
              :height="40"
              @click="goSendCreate"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CommonButton from '@/components/common/CommonButton.vue'
import {fetchAdminNotificationHistory} from "@/api/notificationApi.js";


const router = useRouter()

const keyword = ref('')
const startDate = ref(null) // 'YYYY-MM-DD' 문자열 (value-format 덕분에)
const endDate = ref(null)

const notifications = ref([])

const pagination = ref({
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  size: 10,
})

const loading = ref(false)
const errorMessage = ref('')

// 백엔드에서 목록 가져오기
const loadNotifications = async (page = 0) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const pageData = await fetchAdminNotificationHistory({
      page,
      size: pagination.value.size,
    })

    const p = pageData.pagination || {
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
    }

    pagination.value.currentPage = p.currentPage ?? 0
    pagination.value.totalPages = p.totalPages ?? 0
    pagination.value.totalItems = p.totalItems ?? 0

    // NotificationSummaryResponse -> 화면용 매핑
    notifications.value = (pageData.notifications || []).map((n) => ({
      id: n.notificationId,
      userId: n.userId,
      title: n.notificationTitle,
      body: n.notificationBody,
      sent: n.read,
      createdAt: n.createdAt,
    }))
  } catch (err) {
    console.error(err)
    errorMessage.value = '알림 목록을 불러오지 못했습니다.'
    notifications.value = []
  } finally {
    loading.value = false
  }
}

// 검색 버튼 클릭
const handleSearch = () => {
  // 지금은 서버 검색이 없어서
  // 프론트에서만 필터링 → 페이지를 0으로만 리셋
  pagination.value.currentPage = 0
}

// 필터된 목록 (제목 + 날짜 범위)
const displayNotifications = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const from = startDate.value || null // YYYY-MM-DD
  const to = endDate.value || null

  return notifications.value.filter((item) => {
    const titleMatch =
        !kw || item.title.toLowerCase().includes(kw)

    const createdDate =
        item.createdAt?.split('T')[0] || '' // YYYY-MM-DD

    const fromOk = !from || createdDate >= from
    const toOk = !to || createdDate <= to

    return titleMatch && fromOk && toOk
  })
})

// 페이지 이동 (지금은 서버 페이징 그대로 사용)
const goPage = (page) => {
  if (page < 0 || page >= pagination.value.totalPages) return
  loadNotifications(page)
}

// 발송 일시 포맷: YYYY-MM-DD HH:mm
const formatDateTime = (str) => {
  if (!str) return ''
  const [date, time] = String(str).split('T')
  const hm = (time || '').slice(0, 5) // HH:mm
  return `${date} ${hm}`
}

// 알림 발송 등록 페이지 이동 (라우트 이름은 프로젝트에 맞게 수정)
const goSendCreate = () => {
  router.push({ name: 'AdminAlarmSendCreate' })
}

onMounted(() => {
  loadNotifications(0)
})
</script>

<style scoped lang="scss">
.send-list-page {
  padding: 24px 32px 40px;
  background: #f9fbfd;
  min-height: 100%;
}

.send-list-container {
  max-width: 980px;
  margin: 0 auto;
}

/* 제목 */
.page-header {
  margin-bottom: 12px;

  h1 {
    font-size: 22px;
    font-weight: 700;
    color: #111827;
  }
}

/* 검색 카드 */
.search-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.04);
  padding: 16px 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-row {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  column-gap: 12px;
}

.search-row--date .field-main {
  grid-column: 2 / 4;
}

.field-label {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.field-main {
  width: 100%;
}

.keyword-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  height: 38px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  height: 38px;
}

.tilde {
  font-size: 16px;
  color: #6b7280;
}

/* 테이블 카드 */
.table-card {
  margin-top: 18px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(17, 24, 39, 0.04);
  padding: 18px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.table-wrapper {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 80px 150px 80px 1fr 110px 150px;
  align-items: center;
}

.table-head {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  height: 46px;
}

.table-row {
  min-height: 52px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 13px;
  color: #4b5563;
}

.table-row:last-child {
  border-bottom: none;
}

.col {
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.col.body {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 상태 뱃지 */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.status-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
}

/* 초록: 발송완료 */
.status-success {
  background: #e6f6ed;
  color: #15803d;
}
.status-success .dot {
  background: #22c55e;
}

/* 주황: 발송대기 */
.status-pending {
  background: #fef3c7;
  color: #d97706;
}
.status-pending .dot {
  background: #f59e0b;
}



/* 비어 있을 때 */
.empty-state {
  padding: 28px 16px;
  text-align: center;
  color: #9ca3af;
  font-weight: 600;
}

/* 하단 영역 */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.pagination {
  display: flex;
  gap: 6px;
}

.page-btn {
  min-width: 40px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: 0.15s;
}

.page-btn:hover:not(:disabled) {
  background: #fff1f0;
  border-color: #ff4d4f;
  color: #d32f2f;
}

.page-btn:disabled {
  cursor: default;
  color: #d1d5db;
}

.page-btn.active {
  background: #ff0000;
  border-color: #ff0000;
  color: #ffffff;
}

.error-text {
  color: #dc2626;
  font-weight: 600;
  font-size: 13px;
}

@media (max-width: 1080px) {
  .send-list-page {
    padding: 20px 16px;
  }

  .send-list-container {
    max-width: 100%;
  }

  .table-head,
  .table-row {
    grid-template-columns: 70px 120px 70px 1fr 90px 130px;
  }
}
</style>
