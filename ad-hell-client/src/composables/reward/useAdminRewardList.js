import { ref } from "vue";
import { rewardAdminApi } from "@/api/rewardAdminApi.js";

export function useAdminRewardList() {
  const rewards = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const currentPage = ref(1);
  const size = ref(10);

  const totalItems = ref(0);
  const totalPages = ref(1);

  const loadRewards = async () => {
    loading.value = true;

    try {
      const res = await rewardAdminApi.list({
        page: currentPage.value,
        size: size.value,
      });

      const data = res.data.data;

      rewards.value = data.rewards ?? [];
      totalItems.value = data.pagination.totalItems ?? 0;
      totalPages.value = data.pagination.totalPages ?? 1;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    rewards,
    loading,
    error,
    currentPage,
    size,
    totalItems,
    totalPages,
    loadRewards,
  };
}
