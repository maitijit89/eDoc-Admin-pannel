import { createContext } from 'react';
import type { AdminUser } from './types';

export type AuthContextType = {
  user: AdminUser | null;
  setUser: (u: AdminUser | null) => void;
  signOut: () => void;
};

export const authContext = createContext<AuthContextType | undefined>(undefined);
