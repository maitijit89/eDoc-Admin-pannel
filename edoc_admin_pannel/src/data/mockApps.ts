export type AppData = {
  id: string;
  key: 'edoc' | 'edoc-b2b';
  name: string;
  description: string;
  active: boolean;
  users: number;
};

export const initialApps: AppData[] = [
  {
    id: '1',
    key: 'edoc',
    name: 'eDoc Hub',
    description: 'Primary eDoc Hub application for end-users',
    active: true,
    users: 1243,
  },
  {
    id: '2',
    key: 'edoc-b2b',
    name: 'eDoc Hub B2B',
    description: 'Business-to-business portal with extended features',
    active: false,
    users: 87,
  },
];
