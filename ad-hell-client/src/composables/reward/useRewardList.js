import { ref, onMounted } from 'vue'
import { fetchRewards } from '@/api/rewardApi'

export function useRewardList() {
  const rewards = ref([])
  const loading = ref(false)
  const error = ref(null)

  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)
  const size = ref(10) // pageSize 백엔드가 필요하면 사용

  const loadRewards = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await fetchRewards({
        page: currentPage.value,
        size: size.value,
      })

      // 응답 구조에 맞게 매핑
      rewards.value = data.rewards ?? []

      currentPage.value = data.pagination.currentPage
      totalPages.value = data.pagination.totalPages
      totalItems.value = data.pagination.totalItems

    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRewards)

  return {
    rewards,
    loading,
    error,

    currentPage,
    totalPages,
    totalItems,
    size,

    loadRewards,
  }
}
