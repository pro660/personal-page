import { httpClient } from './httpClient';

export async function login(payload) {
  const { data } = await httpClient.post('/auth/login', payload);
  return data;
}

export async function register(payload) {
  const { data } = await httpClient.post('/auth/register', payload);
  return data;
}
