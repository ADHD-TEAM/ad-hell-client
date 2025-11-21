import { ref, onMounted } from 'vue'
import { fetchCategories } from '@/api/categoryApi.js'
import { useFetch } from '@/composables/useFetch'

export function useCategoryList() {
  console.log("useCategoryList");
  const categories = ref([])
  const { data, loading, error, execute } = useFetch(fetchCategories)
  console.log("useCategoryList useFetch 종료");
  const loadCategories = async () => {
    await execute()
    categories.value = data.value?.items || []
  }

  onMounted(loadCategories)

  return {
    categories,
    loading,
    error,
    reload: loadCategories
  }
}
