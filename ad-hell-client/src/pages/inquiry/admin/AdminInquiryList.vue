<!-- src/pages/inquiry/admin/AdminInquiryList.vue -->
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import SearchForm from '@/components/common/SearchForm.vue'
import Pagination from '@/components/common/Pagination.vue'
import DataTable from '@/components/common/DataTable.vue'

const router = useRouter()

// 문의 목록
const inquiries = ref([])
const page = ref(1)
const totalPages = ref(1)

// 검색 폼 (게시판/공지랑 동일 구조 사용)
const searchForm = reactive({
  title: '',
  writer: '',
  fromDate: null,
  toDate: null,
})

// DataTable 컬럼 정의
const columns = [
  { prop: 'id',          label: 'ID',      width: 80 },
  { prop: 'memberName',  label: '회원',    width: 140 },
  {
    prop: 'title',
    label: '제목',
    minWidth: 300,
    showOverflowTooltip: true,
  },
  {
    prop: 'answeredAt',
    label: '답변일자',
    width: 160,
    align: 'center',
  },
  {
    prop: 'status',
    label: '문의 상태',
    width: 120,
    align: 'center',
  },
]

// 목록 조회 (TODO: API 연동)
const loadInquiries = async () => {
  // 나중에 여기만 /api/admin/inquiries 로 교체
  inquiries.value = [
    {
      id: 101,
      memberName: 'adhell',
      title: '포인트 미지급 문의 입니다',
      answeredAt: '2025-11-17',
      status: '답변 완료',
    },
  ]
  totalPages.value = 5
}

// 검색
const onSearch = async () => {
  page.value = 1
  await loadInquiries()
}

// 페이지 변경
const changePage = async (newPage) => {
  page.value = newPage
  await loadInquiries()
}

// 상세 이동
const goDetail = (id) => {
  router.push(`/admin/inquiries/${id}`)
}

onMounted(loadInquiries)
</script>

<template>
  <section class="inquiry-page">
    <h2 class="inquiry-title">문의</h2>

    <div class="inquiry-content">
      <!-- 검색 영역 (공통 SearchForm) -->
      <SearchForm
          :search-form="searchForm"
          @search="onSearch"
      />

      <!-- 목록 타이틀 -->
      <h3 class="inquiry-subtitle">문의 목록</h3>

      <!-- 공통 DataTable -->
      <DataTable
          :data="inquiries"
          :columns="columns"
          empty-text="No Data"
          @select="goDetail"
      />

      <!-- 페이지네이션 -->
      <div class="inquiry-bottom-row">
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
.inquiry-page {
  padding: 24px 32px 40px;
  box-sizing: border-box;
}

.inquiry-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.inquiry-content {
  width: 100%;
}

.inquiry-subtitle {
  margin: 24px 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.inquiry-bottom-row {
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
