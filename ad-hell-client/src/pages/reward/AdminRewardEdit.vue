<script setup>
import { useRoute, useRouter } from "vue-router";
import RewardForm from "@/components/reward/RewardForm.vue";

const route = useRoute();
const router = useRouter();

const rewardId = Number(route.params.id);

const onSaved = () => {
  router.push("/admin/rewards");
};
</script>

<template>
  <section class="reward-edit-page">
    <h1 class="title">경품 수정</h1>
    <RewardForm :reward-id="rewardId" @saved="onSaved" />
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