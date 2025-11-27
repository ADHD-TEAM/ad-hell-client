<script setup>
defineProps({
  items: Array,
  loading: Boolean
});

// 날짜 포맷 함수
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
};
</script>

<template>
  <div class="table-wrapper">
    <el-table
        :data="items"
        v-loading="loading"
        border
        class="history-table"
    >
      <el-table-column
          prop="createdAt"
          label="날짜"
          width="180"
          :formatter="(_, __, value) => formatDate(value)"
      />

      <el-table-column
          prop="changeAmount"
          label="변경액"
          width="120"
          :formatter="(_, __, value) => value.toLocaleString()"
      />

      <el-table-column
          prop="balance"
          label="잔액"
          width="120"
          :formatter="(_, __, value) => value.toLocaleString()"
      />

      <el-table-column prop="description" label="설명" />
    </el-table>
  </div>
</template>

<style scoped>
.table-wrapper {
  display: flex;
  justify-content: center; /* 테이블 중앙 정렬 */
  margin-top: 20px;
}

.history-table {
  width: 600px; /* 테이블 크기 줄임 */
}
</style>
