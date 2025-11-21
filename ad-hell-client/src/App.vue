<script setup>
  import HeadBar from '@/components/common/CommonHeadBar.vue';
</script>

<template>
  <HeadBar />
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <router-view />
</template>

<style scoped></style>
