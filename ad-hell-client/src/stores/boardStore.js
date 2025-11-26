// src/stores/boardStore.js
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import {
    fetchBoards,
    fetchBoardDetail,
    createBoard,
    updateBoard,
} from '@/api/boardApi'

export const useBoardStore = defineStore('board', () => {
    // 목록, 전체 개수, 로딩, 상세
    const boards = ref([])
    const total = ref(0)
    const loading = ref(false)
    const boardDetail = ref(null)

    const page = ref(1)
    const size = ref(10)

    // 검색 폼(제목, 작성자, 기간) - 화면에서 사용하는 키 그대로 유지
    const searchForm = reactive({
        title: '',
        writer: '',
        fromDate: '', // 시작일 (YYYY-MM-DD)
        toDate: '',   // 종료일 (YYYY-MM-DD)
    })

    // 전체 페이지 수
    const totalPages = computed(() => {
        if (!total.value || !size.value) return 1
        return Math.max(1, Math.ceil(total.value / size.value))
    })

    // 백엔드 BoardSearchRequest 에 맞춰 쿼리 구성
    const buildQuery = () => ({
        page: page.value,
        size: size.value,

        // 제목 → keyword 로 넘김
        keyword: searchForm.title || undefined,

        startDate: searchForm.startDate || undefined,
        endDate: searchForm.endDate || undefined,
    })

    // 목록 조회
    const loadBoards = async () => {
        loading.value = true
        try {
            const params = buildQuery()
            const data = await fetchBoards(params) // { boards, pagination }

            boards.value = data.boards ?? []
            total.value = data.pagination?.totalItems ?? 0

            if (data.pagination?.currentPage) {
                page.value = data.pagination.currentPage
            }
        } catch (e) {
            console.error('loadBoards error:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    // 상세 조회
    const loadBoardDetail = async (id) => {
        loading.value = true
        try {
            const data = await fetchBoardDetail(id)
            boardDetail.value = data
        } catch (e) {
            console.error('loadBoardDetail error:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    // 게시글 등록
    const createBoardAction = async (payload) => {
        try {
            await createBoard(payload)
        } catch (e) {
            console.error('createBoardAction error:', e)
            throw e
        }
    }

    // 게시글 수정
    const updateBoardAction = async (id, payload) => {
        try {
            await updateBoard(id, payload)
        } catch (e) {
            console.error('updateBoardAction error:', e)
            throw e
        }
    }

    // 검색 버튼 클릭
    const search = async () => {
        page.value = 1
        await loadBoards()
    }

    // 페이지 변경
    const changePage = async (newPage) => {
        page.value = newPage
        await loadBoards()
    }

    // 검색 리셋
    const reset = async () => {
        searchForm.title = ''
        searchForm.writer = ''
        searchForm.fromDate = ''
        searchForm.toDate = ''
        page.value = 1
        await loadBoards()
    }

    return {
        // state
        boards,
        total,
        loading,
        boardDetail,
        page,
        size,
        searchForm,

        // getters
        totalPages,

        // actions
        loadBoards,
        loadBoardDetail,
        createBoardAction,
        updateBoardAction,
        search,
        changePage,
        reset,
    }
})
