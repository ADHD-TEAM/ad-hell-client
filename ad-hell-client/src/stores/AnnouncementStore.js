// src/stores/announcementStore.js
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import {
    fetchAnnouncements,
    fetchAnnouncementDetail,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '@/api/announcementApi.js'

export const useAnnouncementStore = defineStore('announcement', () => {
    // 목록
    const announcements = ref([])
    // 상세 (ref로 들고, 컴포넌트에서는 .value 사용)
    const announcementDetail = ref(null)

    const page = ref(1)
    const size = ref(10)
    const totalItems = ref(0)

    const loading = ref(false)

    const searchForm = reactive({
        title: '',
        fromDate: '',
        toDate: '',
    })

    const totalPages = computed(() => {
        if (!totalItems.value || !size.value) return 1
        return Math.max(1, Math.ceil(totalItems.value / size.value))
    })

    const buildQuery = () => ({
        page: page.value,
        size: size.value,
        keyword: searchForm.title || undefined,
        startDate: searchForm.fromDate || undefined,
        endDate: searchForm.toDate || undefined,
    })

    /** 공지 목록 조회 */
    const loadAnnouncements = async () => {
        loading.value = true
        try {
            const params = buildQuery()
            const data = await fetchAnnouncements(params)

            const list =
                data.announcements ||
                data.items ||
                data.data ||
                data ||
                []

            announcements.value = list
            totalItems.value = data.pagination?.totalItems ?? list.length

            if (data.pagination?.currentPage) {
                page.value = data.pagination.currentPage
            }
        } finally {
            loading.value = false
        }
    }

    /** 공지 상세 조회 */
    const loadAnnouncementDetail = async (id) => {
        loading.value = true
        try {
            const data = await fetchAnnouncementDetail(id)

            // 응답 래핑 형식 통일 (data.data / data.announcement / data 중 하나)
            const detail = data.announcement || data.data || data

            // 목록/상세/수정에서 공통으로 사용
            announcementDetail.value = {
                id: detail.id,
                title: detail.title,
                content: detail.content,
                writerName: detail.writerName,
                createdAt: detail.createdAt,
                status: detail.status ?? 'Y',
            }

            return announcementDetail.value
        } finally {
            loading.value = false
        }
    }

    /** 공지 등록 */
    const createAnnouncementAction = async ({ title, content, status = 'Y' }) => {
        await createAnnouncement({ title, content, status })
    }

    /** 공지 수정 */
    const updateAnnouncementAction = async (id, { title, content, status = 'Y' }) => {
        await updateAnnouncement(id, { title, content, status })
        // 수정 후 상세 재조회해서 Detail/Edit 모두 같은 데이터 보게 함
        await loadAnnouncementDetail(id)
    }

    /** 공지 삭제 */
    const deleteAnnouncementAction = async (id) => {
        await deleteAnnouncement(id)
        // 삭제 후 상세 초기화
        if (announcementDetail.value?.id === id) {
            announcementDetail.value = null
        }
    }

    /** 검색 */
    const search = async () => {
        page.value = 1
        await loadAnnouncements()
    }

    /** 페이지 변경 */
    const changePage = async (newPage) => {
        page.value = newPage
        await loadAnnouncements()
    }

    /** 검색폼 리셋 */
    const reset = async () => {
        searchForm.title = ''
        searchForm.fromDate = ''
        searchForm.toDate = ''
        page.value = 1
        await loadAnnouncements()
    }

    return {
        // state
        announcements,
        announcementDetail,
        page,
        size,
        totalPages,
        searchForm,
        loading,

        // actions
        loadAnnouncements,
        loadAnnouncementDetail,
        createAnnouncementAction,
        updateAnnouncementAction,
        deleteAnnouncementAction,
        search,
        changePage,
        reset,
    }
})
