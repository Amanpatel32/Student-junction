import client from './client';

export const login = (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data);
export const getMe = () => client.get('/auth/me').then((r) => r.data);
export const registerUser = (data) => client.post('/auth/register', data).then((r) => r.data);
export const registerStudent = (data) => client.post('/auth/register-student', data).then((r) => r.data);
