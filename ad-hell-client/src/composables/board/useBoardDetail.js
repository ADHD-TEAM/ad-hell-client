// src/composables/board/useBoardDetail.js
import { ref, onMounted } from 'vue'
import { fetchBoardDetail } from '@/api/boardApi'
import {
    fetchBoardComments,
    createBoardComment,
    updateBoardComment,
    deleteBoardComment,
} from '@/api/boardCommentApi'

// TODO: 나중에 authStore.getUserId() 등으로 교체
const loginUserId = 1

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

    // 게시글 + 댓글 조회
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

            // 응답이 배열이면 그대로, 객체면 comments/items 속성에서 추출
            let list = []
            if (Array.isArray(commentRes)) {
                list = commentRes
            } else if (commentRes) {
                list =
                    commentRes.comments ||
                    commentRes.items ||
                    commentRes.data ||
                    []
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

        try {
            await createBoardComment({
                boardId,
                writerId: loginUserId,
                content,
            })
            newComment.value = ''
            await loadDetail()
        } catch (e) {
            console.error(e)
            alert('댓글 등록 중 오류가 발생했습니다.')
        }
    }

    // 댓글 수정
    const editComment = async (comment) => {
        const updated = prompt('댓글 내용을 수정하세요.', comment.content)
        if (updated == null) return

        const trimmed = updated.trim()
        if (!trimmed) return

        try {
            await updateBoardComment(comment.id, {
                writerId: loginUserId,
                content: trimmed,
            })
            await loadDetail()
        } catch (e) {
            console.error(e)
            alert('댓글 수정 중 오류가 발생했습니다.')
        }
    }

    // 댓글 삭제
    const removeComment = async (comment) => {
        if (!confirm('댓글을 삭제하시겠습니까?')) return

        try {
            await deleteBoardComment(comment.id, loginUserId)
            await loadDetail()
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
