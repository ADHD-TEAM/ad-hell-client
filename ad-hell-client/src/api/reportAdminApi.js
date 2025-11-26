import api from "./api";

const BASE = "/admin/reports";

export const reportAdminApi = {
  list(params = {}) {
    return api.get(BASE, { params });
  },

  detail(id) {
    return api.get(`${BASE}/${id}`);
  },

  updateStatus(id, status) {
    return api.patch(`${BASE}/${id}/status`, null, {
      params: { status }
    });
  }
};
