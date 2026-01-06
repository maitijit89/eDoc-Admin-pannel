import React, { useEffect, useState } from 'react';
import { authContext } from './context';
import type { AdminUser } from './types';

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const raw = localStorage.getItem('admin.user');
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch (err) {
      // parsing failed
      console.warn('Failed to read admin.user from localStorage', err);
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('admin.user', JSON.stringify(user));
      else localStorage.removeItem('admin.user');
    } catch (err) {
      console.warn('Failed to persist admin.user to localStorage', err);
    }
  }, [user]);

  function signOut() {
    setUser(null);
    try {
      localStorage.removeItem('admin.google.clientId');
    } catch (err) {
      console.warn('Failed to remove clientId from localStorage', err);
    }
  }

  const value = React.useMemo(() => ({ user, setUser, signOut }), [user]);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}


