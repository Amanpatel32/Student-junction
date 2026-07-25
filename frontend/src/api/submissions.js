import client from './client';

export const submitTest = (testId, answers) => client.post('/submissions', { testId, answers }).then((r) => r.data);
export const fetchTestSubmissions = (testId) => client.get(`/submissions/test/${testId}`).then((r) => r.data);
export const fetchMySubmissions = () => client.get('/submissions/my').then((r) => r.data);
