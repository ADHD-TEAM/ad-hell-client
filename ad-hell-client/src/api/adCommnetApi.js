import api from './api.js';

export async function fetchAdComments(item) {
    return api.get(`/ad/comments/${item}`);
}