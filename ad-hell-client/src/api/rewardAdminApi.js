// src/api/rewardAdminApi.js (관리자)

import api from './api'

const BASE = '/admin/rewards'

export const rewardAdminApi = {
  list(params = {}) {
    return api.get(BASE, { params })
  },

  detail(id) {
    return api.get(`${BASE}/${id}/stocks`)
  },

  detailReward(id) {
    return api.get(`${BASE}/${id}`)
  },

  create(payload) {
    const form = new FormData();

    form.append(
        "reward",
        new Blob([JSON.stringify({
          name: payload.name,
          description: payload.description,
          pointCost: payload.pointCost,
          categoryId: payload.categoryId,
        })], { type: "application/json" })
    );

    if (payload.image) {
      form.append("image", payload.image);
    }

    return api.post(BASE, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  update(id, payload) {
    const form = new FormData();

    form.append(
        "reward",
        new Blob([JSON.stringify({
          name: payload.name,
          description: payload.description,
          pointCost: payload.pointCost,
          categoryId: payload.categoryId,
          deleteImage: payload.deleteImage ?? false
        })], { type: "application/json" })
    );

    if (payload.image) {
      form.append("image", payload.image);
    }

    return api.put(`${BASE}/${id}`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },

  delete(id) {
    return api.delete(`${BASE}/${id}`)
  },

  addStock(id, payload) {
    return api.post(`${BASE}/${id}/stocks`, payload)
  }
}
