import api from './api.js';

export async function fetchUsers(payload) {

    const res =  await api.get("/admins/users" , payload);
    console.log(res);
    return null;
}
