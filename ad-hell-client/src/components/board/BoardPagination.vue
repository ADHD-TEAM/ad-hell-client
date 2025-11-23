<script setup>
import PageButton from '@/components/common/PageButton.vue'

const props = defineProps({
  // 현재 페이지
  page: {
    type: Number,
    required: true,
  },
  // 전체 페이지 수
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['change-page'])
</script>

<template>
  <div class="pagination">
    <!-- 이전 버튼 -->
    <PageButton
        type="prev"
        :disabled="page === 1"
        @click="emit('change-page', page - 1)"
    >
      이전
    </PageButton>

    <!-- 숫자 버튼 -->
    <PageButton
        v-for="p in totalPages"
        :key="p"
        type="number"
        :active="p === page"
        @click="emit('change-page', p)"
    >
      {{ p }}
    </PageButton>

    <!-- 다음 버튼 -->
    <PageButton
        type="next"
        :disabled="page === totalPages"
        @click="emit('change-page', page + 1)"
    >
      다음
    </PageButton>
  </div>
</template>

<style scoped lang="scss">
/* 부모가 위치를 잡고, 안에서는 버튼만 나열 */
.pagination {
  display: flex;
  gap: 8px;
}
</style>
