// src/composables/useBoardList.js
import { ref, onMounted } from 'vue'
import { fetchBoards } from '@/api/boardApi'

// 검색폼 기본 구조는 프로젝트 상황에 맞게 수정 가능
export function useBoardList() {
    const boards = ref([])
    const page = ref(1)
    const totalPages = ref(1)
    const loading = ref(false)
    const error = ref(null)

    const searchForm = ref({
        title: '',
        writerName: '',
        // 필요하면 createdFrom, createdTo 등 추가
    })

    const loadBoards = async () => {
        loading.value = true
        error.value = null

        try {
            const res = await fetchBoards({
                page: page.value,
                size: 10,
                title: searchForm.value.title || undefined,
                writerName: searchForm.value.writerName || undefined,
            })

            // BoardListResponse 구조에 맞게 매핑
            boards.value = res.boards || res.items || []
            page.value = res.page || page.value
            totalPages.value = res.totalPages || 1
        } catch (e) {
            console.error(e)
            error.value = e
            boards.value = []
        } finally {
            loading.value = false
        }
    }

    const search = async () => {
        page.value = 1
        await loadBoards()
    }

    const changePage = async (newPage) => {
        page.value = newPage
        await loadBoards()
    }

    onMounted(loadBoards)

    return {
        boards,
        page,
        totalPages,
        searchForm,
        loading,
        error,
        loadBoards,
        search,
        changePage,
    }
}
