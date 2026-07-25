import client from './client';

export const markAttendance = (data) => client.post('/attendance', data).then((r) => r.data);
export const fetchCourseAttendance = (courseId) => client.get(`/attendance/course/${courseId}`).then((r) => r.data);
export const fetchMyAttendance = (courseId) => client.get(`/attendance/my/${courseId}`).then((r) => r.data);
