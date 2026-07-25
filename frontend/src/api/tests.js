import client from './client';

export const fetchCourseTests = (courseId) => client.get(`/tests/course/${courseId}`).then((r) => r.data);
export const fetchTest = (id) => client.get(`/tests/${id}`).then((r) => r.data);
export const createTest = (data) => client.post('/tests', data).then((r) => r.data);
export const updateTest = (id, data) => client.put(`/tests/${id}`, data).then((r) => r.data);
export const deleteTest = (id) => client.delete(`/tests/${id}`).then((r) => r.data);
