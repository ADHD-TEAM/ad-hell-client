import api from './api'

export const fetchPointHistory = () => {
  return api.get('/users/point')
}

export const earnPoint = (payload) => {
  return api.post('/users/point', payload)
}