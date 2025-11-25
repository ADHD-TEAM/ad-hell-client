import { ref, onMounted } from 'vue'
import { fetchReward } from '@/api/rewardApi'

export function useRewardDetail(id) {
  const reward = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadReward = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await fetchReward(id)
      reward.value = res.data.data   // detail 구조에 맞게 수정
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(loadReward)

  return { reward, loading, error, loadReward }
}
