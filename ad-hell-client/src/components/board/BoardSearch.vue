<script setup>
import CommonButton from '@/components/common/CommonButton.vue'

// 부모에서 전달받는 검색 데이터
const props = defineProps({
  searchForm: {
    type: Object,
    required: true,
  },
})

// 검색 이벤트만 사용
const emit = defineEmits(['search'])
</script>

<template>
  <div class="board-search-box">
    <div class="search-inner">
      <!-- 입력 필드 4개 -->
      <div class="search-grid">
        <div class="search-field">
          <label class="search-label">제목</label>
          <input
              v-model="searchForm.title"
              class="search-input"
              type="text"
              placeholder="제목 또는 내용"
          />
        </div>

        <div class="search-field">
          <label class="search-label">작성자</label>
          <input
              v-model="searchForm.writer"
              class="search-input"
              type="text"
              placeholder="작성자"
          />
        </div>

        <div class="search-field">
          <label class="search-label">시작일</label>
          <input
              v-model="searchForm.fromDate"
              class="search-input"
              type="date"
          />
        </div>

        <div class="search-field">
          <label class="search-label">종료일</label>
          <input
              v-model="searchForm.toDate"
              class="search-input"
              type="date"
          />
        </div>
      </div>

      <!-- 검색 버튼 -->
      <div class="search-actions">
        <CommonButton type="search" @click="emit('search')" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 검색 박스: 메인 영역 전체 사용 */
.board-search-box {
  width: 100%;
  margin: 0 0 38px 0;
  background: #f7f5f5;
  border-radius: 10px;
  padding: 20px 24px;
}

/* 전체 정렬 + 반응형 wrap */
.search-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 24px;
}

/* 입력칸을 2열 grid로 구성 */
.search-grid {
  flex: 1 1 0;
  min-width: 260px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 120px;
  row-gap: 16px;
}

.search-field {
  display: flex;
  flex-direction: column;
}

.search-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #555;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e2e2e2;
  background: #fff;
}

.search-input::placeholder {
  color: #9e9e9e;
}

/* 검색 버튼 영역 */
.search-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 8px;
}

/* 화면 좁아지면 1열 + 버튼 가로 정렬 */
@media (max-width: 900px) {
  .search-inner {
    flex-direction: column;
    align-items: stretch;
  }

  .search-grid {
    grid-template-columns: 1fr;
    column-gap: 0;
  }

  .search-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
