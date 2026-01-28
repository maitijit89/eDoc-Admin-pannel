export type AppData = {
  id: string;
  key: 'edoc' | 'edoc-b2b';
  name: string;
  description: string;
  active: boolean;
  users: number;
};

export type AgeGroup = 'under18' | '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type User = {
  id: string;
  appKey: 'edoc' | 'edoc-b2b';
  name: string;
  ageGroup: AgeGroup;
  gender: Gender;
  location: string;
  totalSeconds: number; // cumulative time in seconds
  isTracking?: boolean;
  trackingStart?: number | null; // timestamp in ms
};
