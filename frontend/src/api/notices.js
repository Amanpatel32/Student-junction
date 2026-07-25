import client from './client';

export const fetchNotices = () => client.get('/notices').then((r) => r.data);
export const createNotice = (data) => client.post('/notices', data).then((r) => r.data);
export const deleteNotice = (id) => client.delete(`/notices/${id}`).then((r) => r.data);
