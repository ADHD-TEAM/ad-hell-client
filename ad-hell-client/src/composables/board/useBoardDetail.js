// src/composables/board/useBoardDetail.js
import { ref, onMounted } from 'vue'
import { fetchBoardDetail } from '@/api/boardApi'
import {
    fetchBoardComments,
    createBoardComment,
    updateBoardComment,
    deleteBoardComment,
} from '@/api/boardCommentApi'
import { useAuthStore } from '@/stores/authStore.js'

export function useBoardDetail(boardId) {
    // 게시글 기본 값
    const board = ref({
        id: boardId,
        title: '',
        writerName: '',
        createdAt: '',
        viewCount: 0,
        content: '',
        files: [],
    })

    const comments = ref([])
    const newComment = ref('')
    const loading = ref(false)
    const error = ref(null)

    const authStore = useAuthStore()

    // 게시글 + 댓글 조회 (초기/새로고침용)
    const loadDetail = async () => {
        loading.value = true
        error.value = null

        try {
            // 게시글 상세
            const boardRes = await fetchBoardDetail(boardId)
            board.value = {
                id: boardRes.id,
                title: boardRes.title,
                writerName: boardRes.writerName,
                createdAt: boardRes.createdAt,
                viewCount: boardRes.viewCount,
                content: boardRes.content,
                files: boardRes.files || [],
            }

            // 댓글 목록
            const commentRes = await fetchBoardComments({
                boardId,
                page: 1,
                size: 50,
            })

            let list = []
            if (Array.isArray(commentRes)) {
                list = commentRes
            } else if (Array.isArray(commentRes.comments)) {
                list = commentRes.comments
            } else if (Array.isArray(commentRes.content)) {
                list = commentRes.content
            }

            comments.value = list
        } catch (e) {
            console.error(e)
            error.value = e
            alert('게시글 정보를 불러오는 중 오류가 발생했습니다.')
        } finally {
            loading.value = false
        }
    }

    // 댓글 등록
    const addComment = async () => {
        const content = newComment.value.trim()
        if (!content) return

        const writerId = authStore.user?.userId
        if (!writerId) {
            alert('로그인이 필요합니다.')
            return
        }

        try {
            // ★ 서버에 등록
            const created = await createBoardComment({
                boardId,
                writerId,
                content,
            })

            // ★ 목록에 바로 반영
            if (created && created.id) {
                // 최신 댓글을 위에 보이게 하고 싶으면 unshift
                comments.value = [created, ...comments.value]
            } else {
                // 혹시 created 구조 모르면 안전하게 전체 재조회
                await loadDetail()
            }

            newComment.value = ''
        } catch (e) {
            console.error(e)
            alert('댓글 등록 중 오류가 발생했습니다.')
        }
    }

    // 댓글 수정
    const editComment = async (comment) => {
        const updatedText = prompt('댓글 내용을 수정하세요.', comment.content)
        if (updatedText == null) return

        const trimmed = updatedText.trim()
        if (!trimmed) return

        const writerId = authStore.user?.userId
        if (!writerId) {
            alert('로그인이 필요합니다.')
            return
        }

        try {
            // ★ 서버에 수정 요청
            const updated = await updateBoardComment(comment.id, {
                writerId,
                content: trimmed,
            })

            // ★ 목록에 바로 반영
            if (updated && updated.id) {
                const idx = comments.value.findIndex((c) => c.id === updated.id)
                if (idx !== -1) {
                    comments.value[idx] = updated
                }
            } else {
                // 응답 구조 모르면 전체 재조회
                await loadDetail()
            }
        } catch (e) {
            console.error(e)
            alert('댓글 수정 중 오류가 발생했습니다.')
        }
    }

    // 댓글 삭제
    const removeComment = async (comment) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return

        const writerId = authStore.user?.userId
        if (!writerId) {
            alert('로그인이 필요합니다.')
            return
        }

        try {

            await deleteBoardComment(comment.id, writerId)

            comments.value = comments.value.filter((c) => c.id !== comment.id)
        } catch (e) {
            console.error(e)
            alert('댓글 삭제 중 오류가 발생했습니다.')
        }
    }

    onMounted(loadDetail)

    return {
        board,
        comments,
        newComment,
        loading,
        error,
        loadDetail,
        addComment,
        editComment,
        removeComment,
    }
}
