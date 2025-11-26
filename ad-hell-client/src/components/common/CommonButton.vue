<!--버튼 컴포넌트-->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: '50px',
  },
  height: {
    type: [String, Number],
    default: '40px',
  },
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 버튼 라벨
const labels = {
  search: '검색',
  delete: '삭제',
  write: '글쓰기',
  register: '등록',
  update: '수정',
  save: '저장',
  cancel: '취소',
  reset: '초기화',
  change: '교환',
  list : '목록',
  detail: '상세',
  completion: '완료'
}

const label = computed(() => labels[props.type] ?? props.type)

// 색상 타입
const variant = computed(() => {
  const soft = ['search', 'delete', 'list']
  const primary = ['write', 'register', 'update', 'save', 'change', 'completion']
  const outline = ['cancel', 'reset', 'detail']

  if (soft.includes(props.type)) return 'soft'
  if (primary.includes(props.type)) return 'primary'
  if (outline.includes(props.type)) return 'outline'
  return 'default'
})

// 실제 크기
const sizeStyle = computed(() => ({
  width: typeof props.width === 'number' ? props.width + 'px' : props.width,
  height: typeof props.height === 'number' ? props.height + 'px' : props.height,
}))
</script>

<template>
  <button
      class="common-btn"
      type="button"
      :class="[`common-btn--${variant}`, { 'is-active': active }]"
      :style="sizeStyle"
      :disabled="disabled"
  >
    {{ label }}
  </button>
</template>

<style scoped lang="scss">
.common-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 0 4px;

  border-radius: 6px;

  font-size: 13px;
  font-weight: 600;

  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.15s;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 40px;
}

/* soft */
.common-btn--soft {
  background: #ffe2e0;
  color: #ff0000;
}
.common-btn--soft:hover,
.common-btn--soft.is-active {
  background: #ffe2e0;
  border-color: #ff0000;
}

/* primary */
.common-btn--primary {
  background: #ff0000;
  color: #ffffff;
}
.common-btn--primary:hover,
.common-btn--primary.is-active {
  background: #ffe2e0;
  border-color: #ff0000;
  color: #ff0000;
}

/* outline */
.common-btn--outline {
  background: #fff;
  border-color: #ff0000;
  color: #ff0000;
}
.common-btn--outline:hover,
.common-btn--outline.is-active {
  background: #ffe2e0;
  border-color: #ff0000;
}
</style>
