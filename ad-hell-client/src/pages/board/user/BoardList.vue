<!-- src/pages/board/user/BoardList.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores/boardStore.js'

import SearchForm from '@/components/common/SearchForm.vue'
// ✅ BoardTable 대신 공통 DataTable 사용
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import CommonButton from '@/components/common/CommonButton.vue'

const router = useRouter()
const boardStore = useBoardStore()

const {
  boards,
  page,
  totalPages,
  searchForm,
  loadBoards,
  search,
  changePage,
} = boardStore

const goDetail = (id) => {
  router.push(`/boards/${id}`)
}

const goCreate = () => {
  router.push('/boards/create')
}

onMounted(() => {
  loadBoards()
})
</script>

<template>
  <section class="board-page">
    <h2 class="board-title">게시판</h2>

    <div class="board-content">
      <!-- 검색 -->
      <SearchForm
          :search-form="searchForm"
          @search="search"
      />

      <!-- 목록 타이틀 -->
      <h3 class="board-subtitle">게시판 목록</h3>

      <!-- ✅ 공통 DataTable + 게시판 전용 컬럼 -->
      <DataTable
          :data="boards"
          @select="goDetail"
      >
        <el-table-column
            prop="id"
            label="ID"
            width="80"
        />
        <el-table-column
            prop="title"
            label="제목"
            min-width="300"
            show-overflow-tooltip
        />
        <el-table-column
            prop="writerName"
            label="작성자"
            width="140"
        />
        <el-table-column
            prop="createdAt"
            label="작성일"
            width="160"
        />
        <el-table-column
            prop="viewCount"
            label="조회수"
            width="100"
            align="center"
        />
      </DataTable>

      <!-- 페이지네이션 + 글쓰기 버튼 -->
      <div class="board-bottom-row">
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
.board-page {
  padding: 24px 32px 40px;
  box-sizing: border-box;
}

.board-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.board-content {
  width: 100%;
  margin: 0;
}

.board-subtitle {
  margin: 24px 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.board-bottom-row {
  width: 100%;
  margin-top: 12px;
  box-sizing: border-box;
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
  display: flex;
  justify-content: flex-end;
  margin-left: 16px;
}
</style>
