<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBoardStore } from '@/stores/boardStore.js'

import BoardSearch from '@/components/board/BoardSearch.vue'
import BoardTable from '@/components/board/BoardTable.vue'
import BoardPagination from '@/components/board/BoardPagination.vue'
import CommonButton from '@/components/common/CommonButton.vue'

const router = useRouter()
const boardStore = useBoardStore()

// store 값
const {
  boards,
  page,
  totalPages,
  searchForm,
  loadBoards,
  search,
  changePage,
  reset,
} = boardStore

// 상세 이동
const goDetail = (id) => {
  router.push(`/boards/${id}`)
}

// 글쓰기 이동
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

      <!-- 검색 박스 -->
      <BoardSearch
          :search-form="searchForm"
          @search="search"
      />

      <!-- 목록 제목 -->
      <h3 class="board-subtitle">게시판 목록</h3>

      <!-- 목록 테이블 -->
      <BoardTable
          :boards="boards"
          @select="goDetail"
      />

      <!-- 페이지네이션 중앙 + 글쓰기 오른쪽 정렬 -->
      <div class="board-bottom-row">
        <!-- 페이지네이션 (가운데) -->
        <div class="bottom-left">
          <BoardPagination
              :page="page"
              :total-pages="totalPages"
              @change-page="changePage"
          />
        </div>

        <!-- 글쓰기 버튼 (오른쪽 끝) -->
        <div class="bottom-write">
          <CommonButton type="write" @click="goCreate" />
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped lang="scss">
/* 전체 페이지 padding */
.board-page {
  padding: 24px 40px;
}

/* 상단 제목 */
.board-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* 컨텐츠 전체 영역 */
.board-content {
  width: 100%;
}

/* 목록 제목 */
.board-subtitle {
  margin: 24px 0 8px 0;
  font-size: 18px;
  font-weight: 700;
}

/* 하단 정렬 줄: 왼쪽 비워두고 가운데/오른쪽 배치 */
.board-bottom-row {
  width: 100%;
  padding: 0 24px; /* 테이블 padding과 라인 맞춤 */

  display: grid;
  grid-template-columns: 1fr auto auto; /* 왼쪽 여백 / 가운데 / 오른쪽 */
  align-items: center;

  margin-top: 12px;
}

/* 페이지네이션을 가운데 정렬 */
.bottom-left {
  display: flex;
  justify-content: center;
}

/* 글쓰기 버튼 오른쪽 정렬 */
.bottom-write {
  display: flex;
  justify-content: flex-end;
}
</style>
