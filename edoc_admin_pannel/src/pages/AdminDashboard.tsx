import React, { memo } from 'react';
import type { AppData } from '../data/mockApps';
import AppCard from '../components/AppCard';

type Props = {
  apps: AppData[];
  onManage: (key: AppData['key']) => void;
  onToggleActive: (id: string) => void;
};

function AdminDashboard({ apps, onManage, onToggleActive }: Props) {
  return (
    <div className="page admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="muted">Manage your applications from here.</p>

      <div className="card-list">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onManage={onManage} onToggleActive={onToggleActive} />
        ))}
      </div>

      <section className="quick-actions">
        <h2>Quick actions</h2>
        <div className="actions-grid">
          <button className="btn">View usage reports</button>
          <button className="btn">Export users</button>
          <button className="btn">System status</button>
        </div>
      </section>
    </div>
  );
}

export default memo(AdminDashboard);
