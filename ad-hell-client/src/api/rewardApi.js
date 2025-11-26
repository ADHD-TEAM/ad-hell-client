// src/api/rewardApi.js
import api from './api'

export async function fetchRewards(params = {}) {
  const res = await api.get('/rewards', { params })
  return res.data.data
}

export const fetchReward = (id) => api.get(`/rewards/${id}`)
export const exchangeReward = (id) => api.post(`/rewards/${id}/exchange`)
