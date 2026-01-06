export type AgeGroup = 'under18' | '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
export type AuthProvider = 'google' | 'phone' | 'b2b';

export type User = {
  id: string;
  appKey: 'edoc' | 'edoc-b2b';
  name: string;
  ageGroup: AgeGroup;
  gender: Gender;
  location: string;
  authProvider: AuthProvider;
  phone?: string; // present when authProvider === 'phone'
  b2bId?: string; // 6-digit id for B2B login
  b2bPassword?: string; // 8-char password for B2B login
  totalSeconds: number; // cumulative time in seconds
  isTracking?: boolean;
  trackingStart?: number | null; // timestamp in ms
};

export const initialUsers: User[] = [
  {
    id: 'u1',
    appKey: 'edoc',
    name: 'Alice Johnson',
    ageGroup: '25-34',
    gender: 'female',
    location: 'USA',
    authProvider: 'google',
    totalSeconds: 3600,
  },
  {
    id: 'u2',
    appKey: 'edoc',
    name: 'Bob Smith',
    ageGroup: '35-44',
    gender: 'male',
    location: 'Canada',
    authProvider: 'phone',
    phone: '+1-555-234-9876',
    totalSeconds: 420,
  },
  {
    id: 'u3',
    appKey: 'edoc-b2b',
    name: 'Corp Admin',
    ageGroup: '45-54',
    gender: 'prefer-not-to-say',
    location: 'UK',
    authProvider: 'google',
    totalSeconds: 7200,
  },
  {
    id: 'u4',
    appKey: 'edoc-b2b',
    name: 'B2B User',
    ageGroup: '25-34',
    gender: 'male',
    location: 'DE',
    authProvider: 'b2b',
    b2bId: '100234',
    b2bPassword: 'Ab3k9LpQ',
    totalSeconds: 0,
  },
];
