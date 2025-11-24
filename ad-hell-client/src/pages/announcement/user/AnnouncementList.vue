<!-- src/pages/announcement/user/AnnouncementList.vue -->
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import SearchForm from '@/components/common/SearchForm.vue'
import Pagination from '@/components/common/Pagination.vue'
import DataTable from '@/components/common/DataTable.vue'

const router = useRouter()

// 공지사항 목록 (TODO: API 연동)
const announcements = ref([])
const page = ref(1)
const totalPages = ref(1)

// 검색 폼 (게시판 검색과 동일 구조)
const searchForm = reactive({
  title: '',
  writer: '',
  fromDate: null,
  toDate: null,
})

// 목록 조회
const loadAnnouncements = async () => {
  // TODO: /api/announcements 조회 API 연동
  announcements.value = [
    { id: 101, title: '서비스 점검 안내', createdAt: '2025-11-17' },
  ]
  totalPages.value = 5
}

// 검색
const onSearch = async () => {
  page.value = 1
  await loadAnnouncements()
}

// 페이지 변경
const changePage = async (newPage) => {
  page.value = newPage
  await loadAnnouncements()
}

// 상세 이동
const goDetail = (id) => {
  router.push(`/announcements/${id}`)
}

onMounted(() => {
  loadAnnouncements()
})
</script>

<template>
  <section class="announcement-page">
    <h2 class="announcement-title">공지사항</h2>

    <div class="announcement-content">
      <!-- 검색 영역 -->
      <SearchForm
          :search-form="searchForm"
          @search="onSearch"
      />

      <!-- 목록 타이틀 -->
      <h3 class="announcement-subtitle">공지사항 목록</h3>

      <!-- 공지사항 테이블 (공통 DataTable 사용) -->
      <DataTable
          :rows="announcements"
          @select="goDetail"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="제목" />
        <el-table-column
            prop="createdAt"
            label="등록일자"
            width="140"
            align="center"
        />
      </DataTable>

      <!-- 페이지네이션 -->
      <div class="announcement-bottom-row">
        <div class="bottom-left">
          <Pagination
              :page="page"
              :total-pages="totalPages"
              @change-page="changePage"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.announcement-page {
  padding: 24px 32px 40px;
  box-sizing: border-box;
}

.announcement-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.announcement-content {
  width: 100%;
}

.announcement-subtitle {
  margin: 24px 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.announcement-bottom-row {
  width: 100%;
  margin-top: 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-left {
  display: flex;
  justify-content: center;
}
</style>
