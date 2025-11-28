// src/api/myBoardApi.js
import api from './api.js'

// 내가 쓴 게시글 목록 조회
export async function fetchMyBoardPosts({ page, size, keyword }) {
    const response = await api.get('/mypage/boards/posts', {
        params: { page, size, keyword },
    })
    return response.data
}

// 내가 쓴 댓글 목록 조회
export async function fetchMyBoardComments({ page, size, keyword }) {
    const response = await api.get('/mypage/boards/comments', {
        params: { page, size, keyword },
    })
    return response.data
}
