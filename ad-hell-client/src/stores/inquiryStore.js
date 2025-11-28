// src/stores/inquiryStore.js
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import {
    fetchAdminInquiries,
    fetchAdminInquiryDetail,
    updateAdminInquiryAnswer
} from '@/api/inquiryApi'


export const useInquiryStore = defineStore('inquiry', () => {


    const inquiries = ref([])         // 목록
    const total = ref(0)              // 전체 개수
    const loading = ref(false)        // 로딩
    const inquiryDetail = ref(null)   // 상세 데이터

    const page = ref(1)
    const size = ref(10)

    const searchForm = reactive({
        title: '',
        writer: '',
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
        title: searchForm.title || undefined,
        writer: searchForm.writer || undefined,
        fromDate: searchForm.fromDate || undefined,
        toDate: searchForm.toDate || undefined,
    })



    // 목록 조회
    const loadInquiries = async () => {
        loading.value = true
        try {
            const params = buildQuery()
            const data = await fetchAdminInquiries(params)

            inquiries.value = data.items ?? data.inquiries ?? []
            total.value = data.totalCount ?? data.total ?? 0
        } catch (e) {
            console.error('loadInquiries error:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    // 상세 조회
    const loadInquiryDetail = async (id) => {
        loading.value = true
        try {
            const data = await fetchAdminInquiryDetail(id)
            inquiryDetail.value = data
        } catch (e) {
            console.error('loadInquiryDetail error:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    // 관리자 답변 등록/수정
    const updateInquiryAnswer = async (id, payload) => {
        try {
            await updateAdminInquiryAnswer(id, payload)
        } catch (e) {
            console.error('updateInquiryAnswer error:', e)
            throw e
        }
    }

    // 검색
    const search = async () => {
        page.value = 1
        await loadInquiries()
    }

    // 페이지 변경
    const changePage = async (newPage) => {
        page.value = newPage
        await loadInquiries()
    }

    // 검색 리셋
    const reset = async () => {
        searchForm.title = ''
        searchForm.writer = ''
        searchForm.fromDate = null
        searchForm.toDate = null
        page.value = 1
        await loadInquiries()
    }

    // 5) export
    return {
        inquiries,
        total,
        loading,
        inquiryDetail,
        page,
        size,
        searchForm,

        totalPages,

        loadInquiries,
        loadInquiryDetail,
        updateInquiryAnswer,
        search,
        changePage,
        reset,
    }
})
