import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';

const TOKEN_KEY = 'babos_admin_token';
const USERNAME_KEY = 'babos_admin_user';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  adminUsername: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [adminUsername, setAdminUsername] = useState<string | null>(() => sessionStorage.getItem(USERNAME_KEY));

  const login = async (username: string, password: string) => {
    const data = await api.login(username, password);
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USERNAME_KEY, data.username);
    setToken(data.token);
    setAdminUsername(data.username);
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setAdminUsername(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated: !!token, adminUsername, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
