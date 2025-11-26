<script setup>
import RewardForm from "@/components/reward/RewardForm.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onSaved = () => {
  router.push("/admin/rewards");
};
</script>

<template>
  <section class="reward-create-page">
    <h1 class="title"></h1>
    <RewardForm @saved="onSaved" />
  </section>
</template>

<style scoped lang="scss">
  .title {
    flex-shrink: 0;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 16px;
  }
</style>