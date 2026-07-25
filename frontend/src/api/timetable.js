import client from './client';

export const fetchTimetable = () => client.get('/timetable').then((r) => r.data);
export const createSlot = (data) => client.post('/timetable', data).then((r) => r.data);
export const deleteSlot = (id) => client.delete(`/timetable/${id}`).then((r) => r.data);
