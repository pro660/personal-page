import axios from 'axios';
import { clearStoredUser, getAuthToken, getRefreshToken, saveStoredUser } from '../utils/authStorage';

export const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (shouldRefreshAccessToken(status, originalRequest)) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${httpClient.defaults.baseURL}/auth/refresh`, {
          refreshToken: getRefreshToken(),
        });

        saveStoredUser(data);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        clearStoredUser();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && !isAuthRequest(originalRequest?.url)) {
      clearStoredUser();
    }

    return Promise.reject(error);
  }
);

function shouldRefreshAccessToken(status, request) {
  return (
    status === 401 &&
    request &&
    !request._retry &&
    Boolean(getRefreshToken()) &&
    !isAuthRequest(request.url)
  );
}

function isAuthRequest(url = '') {
  return url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout');
}
