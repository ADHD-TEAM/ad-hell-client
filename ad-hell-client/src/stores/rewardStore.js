import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchRewards,
  fetchReward
} from '@/api/rewardApi.js'
import {createReport, fetchReports} from "@/api/reportApi.js";

export const useReportStore = defineStore('board', () => {

  const rewards = ref([])
  const total = ref(0)
  const loading = ref(false)     // 로딩

  const loadRewards = async () => {
    loading.value = true
    try {
      const data = await fetchRewards()

      rewards.value = data.items ?? []
      total.value = data.total ?? 0
    } catch (e) {
      console.error('loadRewards error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    rewards,
    total,
    loading,
    loadRewards,
  }
})
