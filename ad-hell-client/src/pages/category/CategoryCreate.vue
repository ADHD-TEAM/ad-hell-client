<script setup>
import { useRouter } from "vue-router";
import CategoryForm from "@/components/category/CategoryForm.vue";

const router = useRouter();
const onSaved = () => router.push("/admin/categories");
</script>

<template>
  <section class="category-page">
    <h1 class="title">카테고리 등록</h1>
    <CategoryForm @saved="onSaved" />
  </section>
</template>

<style scoped lang="scss">
.category-page {
  padding: 24px 28px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}
</style>
