import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export const createNote = (formData) => api.post('/notes/create', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const getNotes = () => api.get('/notes/getAll');

export const updateNote = (id, data) => api.put(`/notes/${id}`, data);

export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const generateSummary = (id) => api.post(`/notes/${id}/summarize`);
