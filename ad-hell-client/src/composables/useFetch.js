import { ref } from 'vue'

export function useFetch(apiFunc) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const execute = async (...args) => {
    console.log('[useFetch] execute 실행됨')
    loading.value = true
    error.value = null
    try {
      data.value = await apiFunc(...args)
      console.log('[useFetch] apiFunc 실행 완료', data.value)
    } catch (err) {
      console.log('[useFetch] ERROR', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    error,
    execute
  }
}
