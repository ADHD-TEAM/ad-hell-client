<script setup lang="ts">
import { withDefaults } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  showCategory?: boolean        // 카테고리 버튼을 보여줄지 여부
  categoryLabel?: string        // 버튼에 쓸 문구

  iconSrc?: string              // 제목 왼쪽에 붙일 아이콘 이미지 경로
  iconAlt?: string              // 아이콘 대체 텍스트 (옵션)
}>(), {
  showCategory: false,
  categoryLabel: '카테고리 설정',
  iconSrc: undefined,
  iconAlt: '',
})

const emit = defineEmits<{
  (e: 'click-category'): void   // 카테고리 버튼 클릭 이벤트
}>()

const onClickCategory = () => {
  emit('click-category')
}
</script>

<template>
  <div class="page-title-wrapper">
    <!-- 왼쪽: 아이콘 + 제목 -->
    <div class="page-title-left">
      <img
          v-if="props.iconSrc"
          :src="props.iconSrc"
          :alt="props.iconAlt || props.title"
          class="page-title-icon"
      />
      <h2 class="page-title">{{ props.title }}</h2>
    </div>

    <!-- 오른쪽 카테고리 버튼: showCategory 가 true일 때만 표시 -->
    <button
        v-if="props.showCategory"
        type="button"
        class="category-toggle"
        @click="onClickCategory"
    >
      {{ props.categoryLabel }}
      <span class="arrow">▾</span>
    </button>
  </div>
</template>

<style scoped>
.page-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 제목Left / 버튼Right */
  gap: 12px;
}

/* 왼쪽 영역: 아이콘 + 텍스트 */
.page-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 아이콘 */
.page-title-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* 제목 */
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;          /* h2 기본 margin 제거 */
}

/* 오른쪽 옅은 회색 텍스트 + ▼ 버튼 */
.category-toggle {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 14px;
  color: #b0b0b0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.category-toggle:hover {
  color: #888;
}

.arrow {
  font-size: 10px;
}
</style>
