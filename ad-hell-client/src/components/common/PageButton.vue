<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'number', // number | prev | next
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

// 버튼 크기 자동 매핑
const size = {
  number: { width: '30px', height: '30px' },
  prev: { width: '50px', height: '30px' },
  next: { width: '50px', height: '30px' },
}

const style = size[props.type]
</script>

<template>
  <button
      class="page-btn"
      :class="{ active, disabled }"
      :disabled="disabled"
      :style="{ width: style.width, height: style.height }"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.page-btn {
  border-radius: 10px;
  border: 1px solid #ffb3b3;
  background: #fff;
  color: #ff0000;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;

  &.active {
    background: #ffe2e0;
    border-color: #ff0000;
    color: #000;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
