import client from './client';

export const createMark = (data) => client.post('/marks', data).then((r) => r.data);
export const updateMark = (id, data) => client.put(`/marks/${id}`, data).then((r) => r.data);
export const deleteMark = (id) => client.delete(`/marks/${id}`).then((r) => r.data);
export const fetchCourseMarks = (courseId) => client.get(`/marks/course/${courseId}`).then((r) => r.data);
export const fetchReportCard = (courseId, studentId) =>
  client.get(`/marks/report-card/${courseId}`, { params: studentId ? { studentId } : {} }).then((r) => r.data);
