import api from './api'

// 게시글 목록 조회
export async function fetchBoards(params = {}) {
    const res = await api.get('/boards', {
        params,
        skipAuth: true,
    })
    return res.data.data
}

// 게시글 상세 조회
export async function fetchBoardDetail(boardId) {
    const res = await api.get(`/boards/${boardId}`, {
        skipAuth: true,
    })
    return res.data.data
}

// 게시글 등록
export async function createBoard(formData) {
    const res = await api.post('/boards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
}

// 게시글 수정
export async function updateBoard(boardId, requestBody) {
    const res = await api.put(`/boards/${boardId}`, requestBody)
    return res.data
}

// 게시글 삭제
export async function deleteBoard(boardId) {
    const res = await api.delete(`/boards/${boardId}`)
    return res.data
}
// 게시글에 이미지 추가 업로드
export async function appendBoardImages(boardId, files) {
    if (!files || !files.length) return

    const formData = new FormData()
    files.forEach((file) => formData.append('imageFiles', file))

    const res = await api.post(`/boards/${boardId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
}

// 게시글의 이미지 1건 삭제 (storedName 기준)
export async function deleteBoardImage(boardId, storedName) {
    const res = await api.delete(`/boards/${boardId}/images/${storedName}`)
    return res.data
}
