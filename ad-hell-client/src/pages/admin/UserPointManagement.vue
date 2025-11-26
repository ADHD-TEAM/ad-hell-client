<script setup>
import {useRoute} from "vue-router";
const userId = Number(useRoute().params.id);

</script>

<template>
<h1>포인트 상세 {{ userId }}</h1>
</template>

<style scoped>

</style>