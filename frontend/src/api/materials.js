import client from './client';

export const fetchCourseMaterials = (courseId) => client.get(`/materials/course/${courseId}`).then((r) => r.data);
export const createMaterial = (data) => client.post('/materials', data).then((r) => r.data);
export const uploadMaterial = (formData, onProgress) =>
  client
    .post('/materials/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    })
    .then((r) => r.data);
export const deleteMaterial = (id) => client.delete(`/materials/${id}`).then((r) => r.data);
