import api from './api'

const BASE = '/categories'

export const categoryApi = {
  list() {
    return api.get(BASE)
  },
  detail(id) {
    return api.get(`${BASE}/${id}`)
  },
  create(payload) {
    return api.post(BASE, payload)
  },
  update(id, payload) {
    return api.put(`${BASE}/${id}`, payload)
  },
  delete(id) {
    return api.delete(`${BASE}/${id}`)
  }
}
