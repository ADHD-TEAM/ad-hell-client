<script setup>
const props = defineProps({
  // 게시판 목록 데이터
  boards: {
    type: Array,
    required: true,
  },
})

// 행 클릭 시 상위로 id 전달
const emit = defineEmits(['select'])
</script>

<template>
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
          @click="emit('select', board.id)"
      >
        <td>{{ board.id }}</td>
        <td class="title-cell">
          {{ board.title }}
        </td>
        <td>{{ board.writerName }}</td>
        <td>{{ board.createdAt }}</td>
        <td class="center">{{ board.viewCount }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
/* 목록 박스: 메인 영역 전체 사용 */
.board-table-wrapper {
  width: 100%;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  padding: 0 24px 24px;
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
</style>
