import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore("categoryStore", () => {
  const parentCategories = ref([]);

  return { parentCategories };
});
