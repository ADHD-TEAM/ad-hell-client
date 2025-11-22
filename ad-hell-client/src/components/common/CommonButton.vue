<template>
  <button
      class="common-btn"
      :class="[type]"
      @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default', // default, search, reset, write
  },
})
</script>

<style scoped>
.common-btn {
  min-width: 72px;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

/* 검색 버튼 */
.search {
  background: #ffe2e0;
  border-color: #ffb3b3;
  color: #ff0000;
}

/* 초기화 버튼 */
.reset {
  border-color: #e2e2e2;
  color: #333;
  background: white;
}

/* 글쓰기 버튼 */
.write {
  border-radius: 20px;
  min-width: 90px;
  background: #ff0000;
  color: white;
  border: none;
}

/* 기본 버튼 */
.default {
  background: white;
  border-color: #ccc;
}
</style>


<!--pagenation-->
<template>
  <button
      class="page-btn"
      :class="{ active, nav }"
      :disabled="disabled"
      @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  active: Boolean,
  disabled: Boolean,
  nav: Boolean, // 이전/다음 버튼이면 nav=true
})
</script>

<style scoped>
.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #ffb3b3;
  background: #fff;
  color: #ff0000;
  font-size: 14px;
  cursor: pointer;
}

.page-btn.active {
  background: #ffe2e0;
  border-color: #ff0000;
  color: #000; /* active는 검정 */
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
