// src/api/boardApi.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080', // 필요하면 proxy 쓰면 '/api' 만 써도 됨
})

/** 게시판 목록 조회 (검색 + 페이징) */
export async function fetchBoards({ page = 1, size = 20, keyword = '' } = {}) {
    const res = await api.get('/api/boards', {
        params: {
            page,
            size,
            keyword: keyword || undefined,
        },
    })

    return res.data.data
}

/** 게시판 상세 조회 (조회수 증가 포함) */
export async function fetchBoardDetail(boardId) {
    const res = await api.get(`/api/boards/${boardId}`)
    return res.data.data
}
