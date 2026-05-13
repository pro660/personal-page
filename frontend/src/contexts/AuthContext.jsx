import { createContext, useContext, useState } from 'react';
import {
  deleteAccount as deleteAccountRequest,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '../api/authApi';
import { clearStoredUser, getRefreshToken, getStoredUser, saveStoredUser } from '../utils/authStorage';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  async function login(credentials) {
    const authenticatedUser = await loginRequest(credentials);
    setUser(authenticatedUser);
    saveStoredUser(authenticatedUser);
    return authenticatedUser;
  }

  async function register(payload) {
    const registeredUser = await registerRequest(payload);
    setUser(registeredUser);
    saveStoredUser(registeredUser);
    return registeredUser;
  }

  async function logout() {
    const refreshToken = getRefreshToken();
    setUser(null);
    clearStoredUser();

    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch (error) {
        // Local logout should still complete even if the server token is already gone.
      }
    }
  }

  async function deleteAccount() {
    await deleteAccountRequest();
    setUser(null);
    clearStoredUser();
  }

  const value = {
    deleteAccount,
    isAuthenticated: Boolean(user),
    login,
    logout,
    register,
    user,
  };

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
