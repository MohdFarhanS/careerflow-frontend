import { createContext, useState, useEffect } from 'react';
import api, { setAuthState } from '../api/axios';
import { authService } from '../api/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.get('/user')
      .then(({ data }) => {
        if (active) {
          setUser(data);
          setAuthState(true);
        }
      })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });

    const handleUnauthorized = () => {
      setUser(null);
      setAuthState(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      active = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (data) => {
    await authService.getCsrfCookie();
    const res = await authService.login(data);
    setUser(res.data.user);
    setAuthState(true);
    return res.data;
  };

  const register = async (data) => {
    await authService.getCsrfCookie();
    const res = await authService.register(data);
    setUser(res.data.user);
    setAuthState(true);
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setAuthState(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
