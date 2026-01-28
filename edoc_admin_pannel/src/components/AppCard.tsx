import { memo } from 'react';
import type { AppData } from '../types';

type Props = Readonly<{
  app: AppData;
  onManage: (key: AppData['key']) => void;
  onToggleActive: (id: string) => void;
}>;

function AppCard({ app, onManage, onToggleActive }: Props) {
  return (
    <div className="card">
      <h3>{app.name}</h3>
      <p className="muted">{app.description}</p>
      <p className="muted">Users: {app.users}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <label className="switch">
          <input
            type="checkbox"
            checked={app.active}
            onChange={() => onToggleActive(app.id)}
            aria-label={`Toggle ${app.name}`}
          />
          <span className="slider" />
        </label>
        <button className="btn" onClick={() => onManage(app.key)}>
          Manage
        </button>
      </div>
    </div>
  );
}

export default memo(AppCard);
