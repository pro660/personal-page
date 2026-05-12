import { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, register as registerRequest } from '../api/authApi';

const STORAGE_KEY = 'portfolio-user';
const AuthContext = createContext(null);

function getStoredUser() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  async function login(credentials) {
    const authenticatedUser = await loginRequest(credentials);
    setUser(authenticatedUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
    return authenticatedUser;
  }

  async function register(payload) {
    const registeredUser = await registerRequest(payload);
    setUser(registeredUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registeredUser));
    return registeredUser;
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      login,
      logout,
      register,
      user,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
