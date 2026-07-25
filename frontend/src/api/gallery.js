import client from './client';

export const fetchGallery = () => client.get('/gallery').then((r) => r.data);

export const fetchAllGallery = () => client.get('/gallery/all').then((r) => r.data);

export const createGalleryItem = (formData) =>
  client.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

export const updateGalleryItem = (id, formData) =>
  client.put(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

export const deleteGalleryItem = (id) => client.delete(`/gallery/${id}`).then((r) => r.data);

export const toggleGalleryItem = (id) => client.patch(`/gallery/${id}/toggle`).then((r) => r.data);

