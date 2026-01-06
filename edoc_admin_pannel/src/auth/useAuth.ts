import { useContext } from 'react';
import { authContext } from './context';

export function useAuth() {
  const v = useContext(authContext);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
