import { createContext, useState, useEffect } from 'react';
import api, { setAuthState, setAuthToken, getAuthToken } from '../api/axios';
import { authService } from '../api/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Mulai loading hanya jika ada token untuk di-restore; tanpa token tak ada request.
  const [loading, setLoading] = useState(() => !!getAuthToken());

  useEffect(() => {
    let active = true;

    // Restore sesi hanya jika ada token tersimpan; tanpa token tak perlu request.
    if (getAuthToken()) {
      api.get('/user')
        .then(({ data }) => {
          if (active) {
            setUser(data.data ?? data);
            setAuthState(true);
          }
        })
        .catch(() => {
          if (active) {
            setUser(null);
            setAuthToken(null); // token basi → hapus
          }
        })
        .finally(() => { if (active) setLoading(false); });
    }

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
    const res = await authService.login(data);
    setAuthToken(res.token);
    setUser(res.user);
    setAuthState(true);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    setAuthToken(res.token);
    setUser(res.user);
    setAuthState(true);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout(); // BE hapus token dulu
    } finally {
      setAuthToken(null); // baru FE clear
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
