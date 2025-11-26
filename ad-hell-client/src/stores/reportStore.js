// src/stores/boardStore.js
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchReports,
  createReport
} from '@/api/reportApi'

export const useReportStore = defineStore('board', () => {

  const reports = ref([])         // 목록
  const total = ref(0)           // 총 개수
  const loading = ref(false)     // 로딩

  const page = ref(1)
  const size = ref(10)

  const searchForm = reactive({
    category: '',
    status: '',
    fromDate: null,
    toDate: null,
  })

  const totalPages = computed(() => {
    if (!total.value || !size.value) return 1
    return Math.max(1, Math.ceil(total.value / size.value))
  })

  const buildQuery = () => ({
    page: page.value,
    size: size.value,
    category: searchForm.category || undefined,
    status: searchForm.status || undefined,
    fromDate: searchForm.fromDate || undefined,
    toDate: searchForm.toDate || undefined,
  })

  const loadReports = async () => {
    loading.value = true
    try {
      const params = buildQuery()
      const data = await fetchReports(params)

      reports.value = data.items ?? data.boards ?? []
      total.value = data.totalCount ?? data.total ?? 0
    } catch (e) {
      console.error('loadBoards error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createReportAction = async (payload) => {
    try {
      await createReport(payload)
    } catch (e) {
      console.error('createBoardAction error:', e)
      throw e
    }
  }

  const search = async () => {
    page.value = 1
    await loadReports()
  }

  const changePage = async (newPage) => {
    page.value = newPage
    await loadReports()
  }

  const reset = async () => {
    searchForm.category = ''
    searchForm.status = ''
    searchForm.fromDate = null
    searchForm.toDate = null
    page.value = 1
    await loadReports()
  }

  return {
    reports,
    total,
    loading,
    page,
    size,
    searchForm,

    totalPages,

    loadReports,
    createReportAction,
    search,
    changePage,
    reset,
  }
})
