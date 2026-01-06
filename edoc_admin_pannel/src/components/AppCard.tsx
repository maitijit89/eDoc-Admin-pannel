import { memo } from 'react';
import type { AppData } from '../data/mockApps';

type Props = Readonly<{
  app: AppData;
  onManage: (key: AppData['key']) => void;
  onToggleActive: (id: string) => void;
}>;

function AppCard({ app, onManage, onToggleActive }: Props) {
  return (
    <div className="app-card">
      <div className="app-card-row">
        <div>
          <h3>{app.name}</h3>
          <p className="muted">{app.description}</p>
          <p className="muted">Users: {app.users}</p>
        </div>
        <div className="app-actions">
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
    </div>
  );
}

export default memo(AppCard);
