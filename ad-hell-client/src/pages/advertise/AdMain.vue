<script setup lang="ts">
import AdSlotList from './AdSlotList.vue'
import PageTitle from './PageTitle.vue'
import IconSrc from '@/assets/icon/icon-movie.svg'
</script>

<template>
  <PageTitle
      title="광고 목록"
      :show-category="false"
      :icon-src= "IconSrc"
  />
  <AdSlotList/>
</template>

<style scoped>

</style>