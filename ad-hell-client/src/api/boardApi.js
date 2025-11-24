// src/api/boardApi.js
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080',
})

// 목록 조회
export async function fetchBoards(params = {}) {
    const res = await api.get('/api/boards', {
        // params 예시:
        // { page, size, title, writer, fromDate, toDate }
        params,
    })
    return res.data.data
}

// 상세 조회
export async function fetchBoardDetail(boardId) {
    const res = await api.get(`/api/boards/${boardId}`)
    return res.data.data
}

// 게시글 등록
export async function createBoard(formData) {
    const res = await api.post('/api/boards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
}

// 게시글 수정
export async function updateBoard(boardId, formData) {
    const res = await api.put(`/api/boards/${boardId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
}
