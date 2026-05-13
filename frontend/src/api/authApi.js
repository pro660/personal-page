import { httpClient } from './httpClient';

export async function login(payload) {
  const { data } = await httpClient.post('/auth/login', payload);
  return data;
}

export async function register(payload) {
  const { data } = await httpClient.post('/auth/register', payload);
  return data;
}

export async function deleteAccount() {
  await httpClient.delete('/auth/me');
}

export async function refreshSession(refreshToken) {
  const { data } = await httpClient.post('/auth/refresh', { refreshToken });
  return data;
}

export async function logout(refreshToken) {
  await httpClient.post('/auth/logout', { refreshToken });
}
