// src/stores/boardStore.js
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import {
    fetchBoards,
    fetchBoardDetail,
    createBoard,
    updateBoard
} from '@/api/boardApi'

/*
  useBoardStore: 게시판 상태 관리
  - 목록, 상세, 검색, 등록, 수정 기능 포함
*/
export const useBoardStore = defineStore('board', () => {

    // ======================
    // 1) state
    // ======================
    const boards = ref([])         // 목록
    const total = ref(0)           // 총 개수
    const loading = ref(false)     // 로딩
    const boardDetail = ref(null)  // 상세 데이터

    const page = ref(1)
    const size = ref(10)

    const searchForm = reactive({
        title: '',
        writer: '',
        fromDate: null,
        toDate: null,
    })

    // ======================
    // 2) getters
    // ======================
    const totalPages = computed(() => {
        if (!total.value || !size.value) return 1
        return Math.max(1, Math.ceil(total.value / size.value))
    })

    // ======================
    // 3) util
    // ======================
    const buildQuery = () => ({
        page: page.value,
        size: size.value,
        title: searchForm.title || undefined,
        writer: searchForm.writer || undefined,
        fromDate: searchForm.fromDate || undefined,
        toDate: searchForm.toDate || undefined,
    })

    // ======================
    // 4) actions
    // ======================

    // 목록 조회
    const loadBoards = async () => {
        loading.value = true
        try {
            const params = buildQuery()
            const data = await fetchBoards(params)

            boards.value = data.items ?? data.boards ?? []
            total.value = data.totalCount ?? data.total ?? 0
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

    // 검색
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
        searchForm.fromDate = null
        searchForm.toDate = null
        page.value = 1
        await loadBoards()
    }

    // ======================
    // 5) export
    // ======================
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
