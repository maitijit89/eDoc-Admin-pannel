import { memo } from 'react';
import type { AppData } from '../types';
import AppCard from '../components/AppCard';

type Props = {
  apps: AppData[];
  onManage: (key: AppData['key']) => void;
  onToggleActive: (id: string) => void;
};

function AdminDashboard({ apps, onManage, onToggleActive }: Props) {
  return (
    <div className="page">
      <h1>eDoc Admin Panel</h1>
      <p className="muted">Manage your applications and users.</p>

      <div className="card-list">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onManage={onManage} onToggleActive={onToggleActive} />
        ))}
      </div>
    </div>
  );
}

export default memo(AdminDashboard);
