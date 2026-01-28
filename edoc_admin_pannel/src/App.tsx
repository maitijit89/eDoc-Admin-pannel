import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { AppData, User } from './types';
import AdminDashboard from './pages/AdminDashboard';
import EDocHub from './pages/eDocHub';
import EDocHubB2B from './pages/eDocHubB2B';

type Page = 'dashboard' | 'edoc' | 'edoc-b2b';

export default function App() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<Page>('dashboard');

  useEffect(() => {
    axios.get('http://localhost:3001/api/apps').then((response) => {
      setApps(response.data);
    });
    axios.get('http://localhost:3001/api/users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  const selected = useMemo(() => {
    return apps.find((a) => (page === 'edoc' ? a.key === 'edoc' : a.key === 'edoc-b2b'));
  }, [apps, page]);

  function onToggleActive(id: string) {
    const app = apps.find((a) => a.id === id);
    if (app) {
      axios.put(`http://localhost:3001/api/apps/${id}`, { ...app, active: !app.active }).then((response) => {
        setApps((prev) => prev.map((p) => (p.id === id ? response.data : p)));
      });
    }
  }

  function onManage(key: AppData['key']) {
    setPage(key === 'edoc' ? 'edoc' : 'edoc-b2b');
  }

  function onBack() {
    setPage('dashboard');
  }

  const usersForSelected = selected ? users.filter((u) => u.appKey === selected.key) : [];

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">eDoc Admin Panel</div>
        <nav className="topnav">
          <button className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>Dashboard</button>
          <button className={`nav-item ${page === 'edoc' ? 'active' : ''}`} onClick={() => setPage('edoc')}>eDoc Hub</button>
          <button className={`nav-item ${page === 'edoc-b2b' ? 'active' : ''}`} onClick={() => setPage('edoc-b2b')}>eDoc Hub B2B</button>
        </nav>
        <div className="topbar-right">
          <div className="muted small">Signed in as <strong>admin</strong></div>
        </div>
      </header>

      <main className="container">
        {page === 'dashboard' && (
          <AdminDashboard apps={apps} onManage={onManage} onToggleActive={onToggleActive} />
        )}
        {page === 'edoc' && selected && (
          <EDocHub app={selected} onBack={onBack} onToggleActive={onToggleActive} users={usersForSelected} />
        )}
        {page === 'edoc-b2b' && selected && (
          <EDocHubB2B app={selected} onBack={onBack} onToggleActive={onToggleActive} users={usersForSelected} onManage={onManage} />
        )}
      </main>

      <footer className="site-footer">© eDoc Hub — Admin Panel</footer>
    </div>
  );
}
