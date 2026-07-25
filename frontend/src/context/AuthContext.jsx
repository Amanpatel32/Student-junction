import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

// Map teacher role to admin since teacher is no longer used
const normalizeRole = (user) => {
  if (user && user.role === 'teacher') {
    return { ...user, role: 'admin' };
  }
  return user;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lms_token');
    const cachedUser = localStorage.getItem('lms_user');

    if (!token) {
      setLoading(false);
      return;
    }

    if (cachedUser) {
      const normalized = normalizeRole(JSON.parse(cachedUser));
      setUser(normalized);
    }

    authApi
      .getMe()
      .then((freshUser) => {
        const normalized = normalizeRole(freshUser);
        setUser(normalized);
        localStorage.setItem('lms_user', JSON.stringify(normalized));
      })
      .catch(() => {
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await authApi.login(email, password);
    const normalized = normalizeRole(loggedInUser);
    localStorage.setItem('lms_token', token);
    localStorage.setItem('lms_user', JSON.stringify(normalized));
    setUser(normalized);
    return normalized;
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
