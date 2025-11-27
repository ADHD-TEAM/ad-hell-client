<script setup>
import PointHistoryTable from '@/components/features/mypage/PointHistoryTable.vue';
import { ref, onMounted } from 'vue';
import { fetchPointHistory } from '@/api/pointApi.js';

const history = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetchPointHistory();
    history.value = res.data.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="mypage-container">
    <h3>포인트 이력</h3>
    <PointHistoryTable :items="history" :loading="loading" />
  </div>
</template>

<style scoped>
.mypage-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
}

.mypage-container h3 {
  margin-bottom: 10px;
}
</style>
