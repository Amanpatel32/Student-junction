import client from './client';

// Public — no auth needed, called from the landing page
export const submitEnquiry = (data) => client.post('/enquiries', data).then((r) => r.data);

export const fetchEnquiries = () => client.get('/enquiries').then((r) => r.data);
export const updateEnquiry = (id, data) => client.put(`/enquiries/${id}`, data).then((r) => r.data);
export const deleteEnquiry = (id) => client.delete(`/enquiries/${id}`).then((r) => r.data);
