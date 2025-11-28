<!-- src/pages/mypage/MyInquiryList.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import { fetchMyInquiries } from '@/api/inquiryApi.js'

const router = useRouter()

const inquiries = ref([])
const page = ref(1)
const totalPages = ref(1)

// 문의/신고 탭 상태
const activeTab = ref('question')

// 내 문의 목록 조회
const loadMyInquiries = async () => {
  try {
    // page/size 쿼리로 전달
    const res = await fetchMyInquiries({
      page: page.value,
      size: 10,
    })
    const data = res.data // InquiryListResponse 그대로 옴

    // 백엔드 DTO에 맞춰 매핑
    inquiries.value = data.inquiries || []
    totalPages.value = data.pagination?.totalPages || 1
  } catch (e) {
    console.error('loadMyInquiries error:', e)
    inquiries.value = []
    totalPages.value = 1
  }
}

// 목록 행 클릭 → 상세로 이동
const goDetail = (id) => {
  router.push({
    name: 'InquiryDetail',
    params: { id },
  })
}

// 페이지 변경 시 재조회
const changePage = async (newPage) => {
  page.value = newPage
  await loadMyInquiries()
}

// 글쓰기 이동
const goCreate = () => {
  router.push({ name: 'UserInquiryCreate' })
}

onMounted(loadMyInquiries)
</script>

<template>
  <section class="mypage-inquiry-page">
    <div class="inquiry-block">
      <!-- 문의 / 신고 탭 -->
      <div class="inquiry-tab-row">
        <button
            class="tab"
            :class="{ 'tab-active': activeTab === 'question' }"
            @click="activeTab = 'question'"
        >
          문의
        </button>
        <button
            class="tab"
            :class="{ 'tab-active': activeTab === 'report' }"
            @click="activeTab = 'report'"
        >
          신고
        </button>
      </div>

      <!-- 문의 테이블 -->
      <div class="table-wrap" v-if="activeTab === 'question'">
        <DataTable :data="inquiries" @select="goDetail">
          <el-table-column prop="id" label="ID" width="80" />
          <!-- 회원 이름 대신 카테고리명 사용 -->
          <el-table-column
              prop="categoryName"
              label="카테고리"
              width="160"
          />
          <el-table-column
              prop="title"
              label="제목"
              min-width="320"
              show-overflow-tooltip
          />
          <el-table-column
              prop="createdAt"
              label="작성일자"
              width="160"
              align="center"
          />
          <el-table-column
              prop="answeredAt"
              label="답변일자"
              width="160"
              align="center"
          />
        </DataTable>
      </div>

      <!-- 신고 탭 (추후 구현) -->
      <div class="table-wrap" v-else>
        신고 내역이 없습니다.
      </div>

      <!-- 하단 페이징 + 글쓰기 -->
      <div class="bottom-row">
        <div class="bottom-left">
          <Pagination
              :page="page"
              :total-pages="totalPages"
              @change-page="changePage"
          />
        </div>
        <div class="bottom-write">
          <CommonButton type="write" @click="goCreate" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.mypage-inquiry-page {
  padding: 24px 32px 40px;
}

.inquiry-block {
  margin-top: 16px;
}

.inquiry-tab-row {
  display: flex;
  gap: 24px;
  margin: 24px 0 12px;
}

.tab {
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 0;
  color: #888;
}

.tab-active {
  color: #ff0000;
  font-weight: 700;
  border-bottom: 2px solid #ff0000;
}

.table-wrap {
  margin-top: 8px;
}

.bottom-row {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom-left {
  flex: 1;
  display: flex;
  justify-content: center;
}

.bottom-write {
  margin-left: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
