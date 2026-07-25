import client from './client';

export const fetchUsers = (params = {}) => client.get('/users', { params }).then((r) => r.data);
export const updateUser = (id, data) => client.put(`/users/${id}`, data).then((r) => r.data);
export const deleteUser = (id) => client.delete(`/users/${id}`).then((r) => r.data);
