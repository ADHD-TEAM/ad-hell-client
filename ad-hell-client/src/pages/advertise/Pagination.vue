<!-- BasePagination.vue -->
<script setup lang="ts">
import {computed} from "vue";

const props = withDefaults(defineProps<{
  page: number;        // 현재 페이지 (1 기반)
  totalPages: number;  // 총 페이지 수
  maxButtons?: number; // 한번에 보여줄 페이지 버튼 수 (예: 5, 7)
}>(), {
  maxButtons: 5,
})

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const goPage = (p: number) => {
  if (p < 1 || p > props.totalPages || p === props.page) return
  emit('change', p)
}

const pagesToShow = computed(() => {
  const { page, totalPages, maxButtons } = props
  // 결과를 담을 배열
  const pages: number[] = []

  // 1) 전체 페이지 수가 maxButtons 이하인 경우
  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  // 2) maxButtons보다 많을 때 가운데 기준으로 자르기
  const half = Math.floor(maxButtons / 2)
  let start = page - half
  let end = page + half

  if (start < 1) {
    start = 1
    end = maxButtons
  } else if (end > totalPages) {
    end = totalPages
    start = totalPages - maxButtons + 1
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>

<template>
  <div class="pagination">
    <button class="nav-btn" :disabled="page === 1" @click="goPage(1)">
      «
    </button>
    <button class="nav-btn" :disabled="page === 1" @click="goPage(page - 1)">
      ‹
    </button>

    <button
        v-for="p in pagesToShow"
        :key="p"
        class="page-btn"
        :class="{ active: p === page }"
        @click="goPage(p)"
    >
      {{ p }}
    </button>

    <button class="nav-btn" :disabled="page === totalPages" @click="goPage(page + 1)">
      ›
    </button>
    <button class="nav-btn" :disabled="page === totalPages" @click="goPage(totalPages)">
      »
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  gap: 4px;
}
button {
  min-width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
button:disabled {
  opacity: 0.4;
  cursor: default;
}
.page-btn.active {
  background: #ff4d4f;
  color: #fff;
  border-color: #ff4d4f;
}
</style>
