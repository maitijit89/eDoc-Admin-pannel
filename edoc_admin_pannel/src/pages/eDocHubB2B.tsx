import { memo } from 'react';
import type { AppData, User } from '../types';

type Props = Readonly<{
  app: AppData;
  onBack: () => void;
  onToggleActive: (id: string) => void;
  users: User[];
  onManage: (key: AppData['key']) => void;
}>;

function EDocHubB2B({ app, onBack, onToggleActive, users, onManage }: Props) {
  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={onBack}>&larr; Back</button>
      <h1>{app.name}</h1>
      <p className="muted">{app.description}</p>

      <div className="card-list">
        <div className="card">
          <h2>Overview</h2>
          <p>Status: <strong>{app.active ? 'Active' : 'Disabled'}</strong></p>
          <p>Users: {users.length}</p>
          <button className="btn" onClick={() => onToggleActive(app.id)}>{app.active ? 'Disable' : 'Enable'}</button>
        </div>

        <div className="card">
          <h2>Quick Reports</h2>
          <div className="actions-grid">
            <button className="btn" onClick={() => onManage('edoc')}>View eDoc Hub reports</button>
          </div>
        </div>

        <div className="card">
          <h2>Integrations (placeholder)</h2>
          <p>Webhook status, integrations, and sync info will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}

export default memo(EDocHubB2B);
