// src/api/inquiryApi.js
import api from './api'

// 내 문의 목록 조회
export const fetchMyInquiries = (params) => {
    // GET /api/inquiries/my?page=1&size=10 ...
    return api.get('/inquiries/my', { params })
}

// 내 문의 상세 조회
export const fetchMyInquiryDetail = (id) => {
    // GET /api/inquiries/my/{id}
    return api.get(`/inquiries/my/${id}`)
}

// 회원 문의 등록
export const createInquiry = (payload) => {
    return api.post('/inquiries', payload)
}

// 관리자 문의 목록 조회 (GET /api/inquiries/admin)
export const fetchAdminInquiries = (params) => {
    return api.get('/inquiries/admin', { params })
}

// 관리자 문의 상세 조회 (GET /api/inquiries/admin/{id})
export const fetchAdminInquiryDetail = (id) => {
    return api.get(`/inquiries/admin/${id}`)
}

// 관리자 답변 등록/수정 (PATCH /api/inquiries/admin/{id}/answer)
export const answerInquiry = (id, payload) => {
    // payload : { response: '답변 내용' }
    return api.patch(`/inquiries/admin/${id}/answer`, payload)
}