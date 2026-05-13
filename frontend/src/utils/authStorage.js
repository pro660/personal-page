export const AUTH_STORAGE_KEY = 'portfolio-user';

export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    clearStoredUser();
    return null;
  }
}

export function saveStoredUser(user) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function getAuthToken() {
  return getStoredUser()?.token || null;
}

export function getRefreshToken() {
  return getStoredUser()?.refreshToken || null;
}
