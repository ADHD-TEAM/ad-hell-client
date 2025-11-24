<script setup>
import HeadBar from '@/components/common/HeadBar/CommonHeadBar.vue';

import {useRoute} from "vue-router";

const route = useRoute();

</script>

<template>
  <HeadBar />
  <router-view />
  <LoginView />
  <component :is="route.meta.layout === 'none' ? 'router-view' : DefaultLayout">
    <router-view v-if="route.meta.layout === 'none'" />
  </component>
</template>

<style scoped></style>
