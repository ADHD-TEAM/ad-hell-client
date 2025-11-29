// src/api/boardCommentApi.js
import api from './api'

// 댓글 목록 조회
export async function fetchBoardComments({ boardId, page = 1, size = 20, keyword = '' } = {}) {
    const res = await api.get('/board_comments', {
        params: { boardId, page, size, keyword },
    })

    // ✅ 공통 패턴: { success, data: {...} } 또는 그냥 data
    const data = res.data?.data || res.data
    return data
}

// 내 댓글 목록 조회
export async function fetchMyBoardComments(params = {}) {
    const res = await api.get('/board_comments/my', {
        params,
    })
    return res.data.data
}

// 댓글 등록
export async function createBoardComment(requestBody) {
    const res = await api.post('/board_comments', requestBody)
    return res.data.data
}

// 댓글 수정
export async function updateBoardComment(commentId, requestBody) {
    const res = await api.put(`/board_comments/${commentId}`, requestBody)
    return res.data.data
}

// 댓글 삭제
export async function deleteBoardComment(commentId, writerId) {
    const res = await api.delete(`/board_comments/${commentId}`, {
        params: { writerId },
    })
    return res.data.data
}
