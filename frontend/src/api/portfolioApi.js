import { httpClient } from './httpClient';

export async function getHello(config) {
  const { data } = await httpClient.get('/hello', config);
  return data;
}

export async function getProfile(config) {
  const { data } = await httpClient.get('/profile', config);
  return data;
}

export async function getSkills(config) {
  const { data } = await httpClient.get('/skills', config);
  return data;
}

export async function getProjects(config) {
  const { data } = await httpClient.get('/projects', config);
  return data;
}

export async function getOpportunities(config) {
  const { data } = await httpClient.get('/opportunities', config);
  return data;
}

export async function getJobs(config) {
  const { data } = await httpClient.get('/jobs', config);
  return data;
}

export async function createContactMessage(payload) {
  const { data } = await httpClient.post('/contact', payload);
  return data;
}
