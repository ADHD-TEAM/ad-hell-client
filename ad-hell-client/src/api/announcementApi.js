// src/api/announcementApi.js
import api from './api'

// 공지 목록 조회 (회원/관리자 공용)
export async function fetchAnnouncements(params = {}) {
    const res = await api.get('/announcements', { params })
    const data = res.data?.data || res.data
    return data
}

// 공지 상세 조회
export async function fetchAnnouncementDetail(id) {
    const res = await api.get(`/announcements/${id}`)
    const data = res.data?.data || res.data
    return data
}

// 공지 등록 (관리자)
export async function createAnnouncement(payload) {
    const res = await api.post('/announcements', payload)
    // Command 컨트롤러는 DTO 그대로 반환
    return res.data
}

// 공지 수정 (관리자)
export async function updateAnnouncement(id, payload) {
    const res = await api.put(`/announcements/${id}`, payload)
    return res.data
}

// 공지 삭제 (관리자)
export async function deleteAnnouncement(id) {
    await api.delete(`/announcements/${id}`)
}
