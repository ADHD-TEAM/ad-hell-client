<!-- src/components/common/DataTable.vue -->
<script setup>
const props = defineProps({
  // 테이블에 뿌릴 데이터 (게시판/공지/문의 등 공통)
  data: {
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
  <div class="data-table-wrapper">
    <el-table
        :data="data"
        class="data-table"
        @row-click="handleRowClick"
        :highlight-current-row="true"
        empty-text="No Data"
    >
      <!-- 각 화면(게시판/공지/문의)에서 el-table-column 넣는 자리 -->
      <slot />
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.data-table-wrapper {
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

/* 헤더 스타일 */
:deep(.el-table__header-wrapper th) {
  font-weight: 700;
  color: #000000;
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
