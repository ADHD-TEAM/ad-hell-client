<script setup lang="ts">
/* 부모가 넘겨준 props를 자식에서 정의하는 문법 */
const props = defineProps({
  title : {
    type : String,
    required : true
  }
});
</script>

<template>
  <h2 class="PageTitle">{{props.title }}</h2>
</template>

<style scoped>
/* 상단 제목 */
.PageTitle {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}
</style>