<script setup>
import { onMounted } from 'vue'
import { useBoardStore } from '@/stores/boardStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const boardStore = useBoardStore()

const {
  boards,
  total,
  loading,
  page,
  size,
  searchForm,
  totalPages,
  loadBoards,
  search,
  changePage,
  reset,
  loadBoardDetail
} = boardStore

// 상세 페이지 이동
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

    <!-- 🔹 검색 박스 -->
    <div class="board-search-box">

      <!-- 1줄: 제목 + 작성자 -->
      <div class="search-row">
        <div class="search-field">
          <label class="search-label">제목</label>
          <input
              v-model="searchForm.title"
              class="search-input"
              placeholder="제목 또는 내용 검색"
              type="text"
          />
        </div>

        <div class="search-field">
          <label class="search-label">작성자</label>
          <input
              v-model="searchForm.writer"
              class="search-input"
              placeholder="작성자 이름"
              type="text"
          />
        </div>
      </div>

      <!-- 2줄: 날짜 + 버튼 -->
      <div class="search-row">
        <div class="search-field wide">
          <label class="search-label">작성일</label>
          <div class="date-range">
            <input v-model="searchForm.fromDate" type="date" class="search-input date-input" />
            <span class="date-separator">~</span>
            <input v-model="searchForm.toDate" type="date" class="search-input date-input" />
          </div>
        </div>

        <div class="search-actions">
          <button class="btn btn-search" @click="search">검색</button>
          <button class="btn btn-reset" @click="reset">초기화</button>
        </div>
      </div>

    </div>

    <!-- 🔹 게시판 목록 -->
    <h3 class="board-subtitle">게시판 목록</h3>

    <div class="board-table-wrapper">
      <table class="board-table">
        <thead>
        <tr>
          <th style="width: 80px;">ID</th>
          <th>제목</th>
          <th style="width: 140px;">작성자</th>
          <th style="width: 160px;">작성일</th>
          <th class="center" style="width: 100px;">조회수</th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="boards.length === 0">
          <td colspan="5" class="no-data">No Data</td>
        </tr>

        <tr
            v-for="board in boards"
            :key="board.id"
            class="row-clickable"
            @click="goDetail(board.id)"
        >
          <td>{{ board.id }}</td>
          <td class="title-cell">{{ board.title }}</td>
          <td>{{ board.writerName }}</td>
          <td>{{ board.createdAt }}</td>
          <td class="center">{{ board.viewCount }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 🔹 페이지네이션 -->
    <div class="pagination">
      <button
          class="page-btn nav"
          :disabled="page === 1"
          @click="changePage(page - 1)"
      >
        이전
      </button>

      <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ active: p === page }"
          @click="changePage(p)"
      >
        {{ p }}
      </button>

      <button
          class="page-btn nav"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
      >
        다음
      </button>
    </div>

    <!-- 🔹 글쓰기 버튼 -->
    <div class="write-btn-wrapper">
      <button class="btn-write" @click="goCreate">글쓰기</button>
    </div>

  </section>
</template>

<style scoped lang="scss">
.board-page {
  padding: 24px 40px;
}

.board-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* 🔹 검색 박스 ---------------------------- */
.board-search-box {
  background: #f7f5f5;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 32px;
}

.search-row {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.search-field {
  display: flex;
  flex-direction: column;
  flex: 1;

  &.wide {
    flex: 2;
  }
}

.search-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

.search-input {
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e2e2;
  background: #fff;
}

.search-input::placeholder {
  color: #9e9e9e;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  flex: 1;
}

.date-separator {
  font-size: 14px;
  color: #666;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 🔹 버튼들 ---------------------------- */
.btn {
  min-width: 72px;
  height: 40px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-search {
  background: #ffe2e0;
  border-color: #ffb3b3;
  color: #ff0000;
}

.btn-reset {
  border-color: #e2e2e2;
  color: #333;
}

/* 🔹 테이블 ---------------------------- */
.board-subtitle {
  font-size: 18px;
  font-weight: 700;
  margin: 24px 0 8px;
}

.board-table-wrapper {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.board-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead {
    background: #fafafa;
  }

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  th.center,
  td.center {
    text-align: center;
  }

  .no-data {
    padding: 40px 0;
    text-align: center;
    color: #999;
  }

  .row-clickable {
    cursor: pointer;
    &:hover {
      background: #fff7f7;
    }
  }

  .title-cell {
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 🔹 페이지네이션 ---------------------------- */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.page-btn {
  min-width: 40px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #ffb3b3;
  background: #fff;
  color: #ff0000;
  cursor: pointer;
  font-size: 14px;

  &.active {
    background: #ffe2e0;
    border-color: #ff0000;
    color: #000000;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

/* 🔹 글쓰기 버튼 ---------------------------- */
.write-btn-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.btn-write {
  min-width: 90px;
  height: 40px;
  border-radius: 10px;
  background: #ff0000;
  color: #fff;
  border: none;
  font-weight: 700;
  cursor: pointer;
}
</style>
