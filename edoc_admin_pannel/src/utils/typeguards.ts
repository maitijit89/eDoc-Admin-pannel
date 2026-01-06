import { User } from '../data/mockUsers';

export function isUserArray(value: unknown): value is User[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'appKey' in item &&
      'name' in item &&
      'ageGroup' in item &&
      'gender' in item &&
      'location' in item &&
      'authProvider' in item &&
      'totalSeconds' in item
    );
  });
}
