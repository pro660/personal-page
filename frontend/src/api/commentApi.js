import { httpClient } from './httpClient';

export async function getComments(postId) {
  const { data } = await httpClient.get(`/posts/${postId}/comments`);
  return data;
}

export async function createComment(postId, payload) {
  const { data } = await httpClient.post(`/posts/${postId}/comments`, payload);
  return data;
}

export async function updateComment(commentId, payload) {
  const { data } = await httpClient.put(`/comments/${commentId}`, payload);
  return data;
}

export async function deleteComment(commentId) {
  await httpClient.delete(`/comments/${commentId}`);
}
