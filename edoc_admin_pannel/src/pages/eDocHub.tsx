import { memo } from 'react';
import type { AppData } from '../data/mockApps';
import type { User } from '../data/mockUsers';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';

type Props = Readonly<{
  app: AppData;
  onBack: () => void;
  onToggleActive: (id: string) => void;
  users: User[];
  onAddUser: (data: { name: string; ageGroup: User['ageGroup']; gender: User['gender']; location: string; authProvider: User['authProvider']; phone?: string }) => void;
  onToggleUserTracking: (id: string) => void;
}>;

function EDocHub({ app, onBack, onToggleActive, users, onAddUser, onToggleUserTracking }: Props) {
  return (
    <div className="page app-page">
      <button className="btn btn-ghost" onClick={onBack}>&larr; Back</button>
      <h1>{app.name}</h1>
      <p className="muted">{app.description}</p>

      <div className="panel">
        <h2>Overview</h2>
        <p>Status: <strong>{app.active ? 'Active' : 'Disabled'}</strong></p>
        <p>Users: {users.length}</p>
        <button className="btn" onClick={() => onToggleActive(app.id)}>{app.active ? 'Disable' : 'Enable'}</button>
      </div>

      <div className="panel user-area">
        <UserForm onAdd={onAddUser} allowedAuthProviders={['google','phone']} />
        <UserList users={users} onToggleTracking={onToggleUserTracking} />
      </div>

      <div className="panel">
        <h2>Logs (placeholder)</h2>
        <p>Recent activity and logs will be displayed here.</p>
      </div>
    </div>
  );
}

export default memo(EDocHub);
