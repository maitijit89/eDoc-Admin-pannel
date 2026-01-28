import { memo, useState } from 'react';
import type { AgeGroup, Gender } from '../data/mockUsers';

type Props = Readonly<{
  onAdd: (data: { name: string; ageGroup: AgeGroup; gender: Gender; location: string; }) => void;
}>;

const ageGroups: AgeGroup[] = ['under18', '18-24', '25-34', '35-44', '45-54', '55+'];
const genders: Gender[] = ['male', 'female', 'non-binary', 'prefer-not-to-say'];
function UserForm({ onAdd }: Props) {
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('25-34');
  const [gender, setGender] = useState<Gender>('prefer-not-to-say');
  const [location, setLocation] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), ageGroup, gender, location: location.trim() });
    setName('');
    setLocation('');
    setAgeGroup('25-34');
    setGender('prefer-not-to-say');
  }

  return (
    <form className="user-form" onSubmit={submit}>
      <h3>Add user</h3>
      <div className="form-row">
        <input aria-label="Full name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input aria-label="Location" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="form-row">
        <select aria-label="Age group" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}>
          {ageGroups.map((ag) => (
            <option key={ag} value={ag}>
              {ag}
            </option>
          ))}
        </select>
        <select aria-label="Gender" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <button className="btn" type="submit">Add user</button>
      </div>
    </form>
  );
}

export default memo(UserForm);
