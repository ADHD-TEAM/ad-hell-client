<script setup>
import CommonUserHeadBar from '@/components/common/HeadBar/CommonUserHeadBar.vue';

import {useRoute} from "vue-router";

const route = useRoute();

</script>

<template>
  <router-view />
  <LoginView />
  <component :is="route.meta.layout === 'none' ? 'router-view' : DefaultLayout">
    <router-view v-if="route.meta.layout === 'none'" />
  </component>
</template>

<style scoped></style>
