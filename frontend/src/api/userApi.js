import { httpClient } from './httpClient';

export async function getMyProfile() {
  const { data } = await httpClient.get('/users/me');
  return data;
}

export async function changePassword(payload) {
  await httpClient.put('/users/me/password', payload);
}
