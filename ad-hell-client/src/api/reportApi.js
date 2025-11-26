import api from './api'

// 목록 조회
export async function fetchReports(params = {}) {
  const res = await api.get('/api/reports', {
        params,
  })
  return res.data.data
}

export async function createReport(formData) {
  const res = await api.post('/api/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}
