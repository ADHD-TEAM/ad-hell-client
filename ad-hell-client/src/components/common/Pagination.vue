<!-- src/components/board/Pagination.vue -->
<script setup>
import { computed } from 'vue'
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

/**
 * 최대 5개의 페이지만 보이도록 계산
 * 예)
 *  - 1페이지: 1 2 3 4 5
 *  - 4페이지: 2 3 4 5 6
 *  - 마지막(예: 10페이지): 6 7 8 9 10
 */
const visiblePages = computed(() => {
  const pages = []

  // 기본 범위: 현재 페이지 기준 -2 ~ +2
  let start = Math.max(1, props.page - 2)
  let end = Math.min(props.totalPages, start + 4)

  // 전체 개수가 5개 안되면 보정
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
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

    <!-- 숫자 버튼(최대 5개) -->
    <PageButton
        v-for="p in visiblePages"
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
.pagination {
  display: flex;
  gap: 8px;
}
</style>
