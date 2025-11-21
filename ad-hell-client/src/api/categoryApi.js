import api from './api'

export const fetchCategories = () => {
  return api.get('/categories')
}

export const fetchCategory = (id) => {
  return api.get(`/categories/${id}`)
}

export const createCategory = (payload) => {
  return api.post('/categories', payload)
}

export const updateCategory = (id, payload) => {
  return api.put(`/categories/${id}`, payload)
}

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`)
}
