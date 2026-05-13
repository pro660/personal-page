import { httpClient } from './httpClient';

export async function getPosts(params = {}) {
  const { data } = await httpClient.get('/posts', { params });
  return data;
}

export async function getPost(id) {
  const { data } = await httpClient.get(`/posts/${id}`);
  return data;
}

export async function createPost(payload) {
  const { data } = await httpClient.post('/posts', payload);
  return data;
}

export async function updatePost(id, payload) {
  const { data } = await httpClient.put(`/posts/${id}`, payload);
  return data;
}

export async function deletePost(id) {
  await httpClient.delete(`/posts/${id}`);
}
