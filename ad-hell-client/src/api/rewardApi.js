import api from './api'

export async function fetchRewards(params = {}) {
  const res = await api.get('/rewards', { params })
  return res.data.data
}

export const fetchReward = (id) => api.get(`/rewards/${id}`)
export const createReward = (payload) => api.post('/rewards', payload)
export const createRewardStock = (id) => api.post(`/rewards/${id}/stocks`)
export const exchangeReward = (id) => api.post(`/rewards/${id}/exchange`)
export const updateReward = (id, payload) => api.put(`/rewards/${id}`, payload)
export const deleteReward = (id) => api.delete(`/rewards/${id}`)
