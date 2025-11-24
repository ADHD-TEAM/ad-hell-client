<!-- src/components/board/BoardTable.vue -->
<script setup>
const props = defineProps({
  boards: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const handleRowClick = (row) => {
  if (!row || !row.id) return
  emit('select', row.id)
}
</script>

<template>
  <div class="board-table-wrapper">
    <el-table
        :data="boards"
        class="board-table"
        @row-click="handleRowClick"
        :highlight-current-row="true"
        empty-text="No Data"
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
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.board-table-wrapper {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  padding: 0 24px 24px;
  box-sizing: border-box;
}

/* 테이블 전체 폭 100% */
:deep(.el-table) {
  width: 100%;
  font-size: 14px;
}

/* 헤더 배경, 라인 스타일 */
:deep(.el-table__header-wrapper th) {
  font-weight: 700;
  color: #000000
}

/* 바닥줄 색 */
:deep(.el-table__row) td {
  border-bottom: 1px solid #f0f0f0;
}

/* hover 색 */
:deep(.el-table__body tr:hover > td) {
  background: #fff7f7;
  cursor: pointer;
}

/* 비어 있을 때 No Data 스타일 */
:deep(.el-table__empty-block) {
  padding: 40px 0;
}

:deep(.el-table__empty-text) {
  color: #999;
}
</style>
