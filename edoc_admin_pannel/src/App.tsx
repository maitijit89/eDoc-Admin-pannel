import { useMemo, useState } from 'react';
import './styles/admin.css';
import { initialApps, type AppData } from './data/mockApps';
import { initialUsers, type User } from './data/mockUsers';
import AdminDashboard from './pages/AdminDashboard';
import EDocHub from './pages/eDocHub';
import EDocHubB2B from './pages/eDocHubB2B';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/useAuth';
import SignIn from './components/SignIn';

// Helper: generate 6-digit id and 8-char password for B2B credentials
function generateB2BCredentials() {
  const id = Math.floor(100000 + Math.random() * 900000).toString();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pass = '';
  for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
  return { id, pass };
}

type Page = 'dashboard' | 'edoc' | 'edoc-b2b';

function InnerApp() {
  const { user, signOut } = useAuth();

  const [apps, setApps] = useState<AppData[]>(initialApps);
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const raw = localStorage.getItem('admin.users');
      return raw ? (JSON.parse(raw) as User[]) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [page, setPage] = useState<Page>('dashboard');
  const selected = useMemo(() => {
    return apps.find((a) => (page === 'edoc' ? a.key === 'edoc' : a.key === 'edoc-b2b'));
  }, [apps, page]);

  // expose current signed-in user in topbar
  const currentAdmin = user;

  if (!currentAdmin) {
    return <SignIn />;
  }

  function persistUsers(next: User[]) {
    setUsers(next);
    try {
      localStorage.setItem('admin.users', JSON.stringify(next));
    } catch {}
  }

  function onToggleActive(id: string) {
    setApps((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }

  function onManage(key: AppData['key']) {
    setPage(key === 'edoc' ? 'edoc' : 'edoc-b2b');
  }

  function onBack() {
    setPage('dashboard');
  }


  function addUser(appKey: User['appKey'], data: Omit<User, 'id' | 'appKey' | 'totalSeconds'> & { name: string; authProvider: User['authProvider']; phone?: string }) {
    const nextUser: User = {
      id: String(Date.now()),
      appKey,
      name: data.name,
      ageGroup: data.ageGroup,
      gender: data.gender,
      location: data.location,
      authProvider: data.authProvider,
      phone: data.phone,
      totalSeconds: 0,
    } as User;

    if (data.authProvider === 'b2b') {
      const creds = generateB2BCredentials();
      nextUser.b2bId = creds.id;
      nextUser.b2bPassword = creds.pass;
    }

    persistUsers([...users, nextUser]);
  }

  function toggleUserTracking(id: string) {
    const next = users.map((u) => {
      if (u.id !== id) return u;
      if (u.isTracking) {
        // stop tracking
        const now = Date.now();
        const started = u.trackingStart ?? now;
        const delta = Math.floor((now - started) / 1000);
        return { ...u, isTracking: false, trackingStart: null, totalSeconds: (u.totalSeconds ?? 0) + delta };
      }
      // start tracking
      return { ...u, isTracking: true, trackingStart: Date.now() };
    });
    persistUsers(next);
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
          <div className="muted small">Signed in as <strong>{currentAdmin.email}</strong></div>
          <button className="btn btn-ghost" onClick={() => signOut()}>Sign out</button>
        </div>
      </header>

      <main className="container">
        {page === 'dashboard' && (
          <AdminDashboard apps={apps} onManage={onManage} onToggleActive={onToggleActive} />
        )}

        {page === 'edoc' && selected && (
          <EDocHub app={selected} onBack={onBack} onToggleActive={onToggleActive} users={usersForSelected} onAddUser={(data) => addUser('edoc', data)} onToggleUserTracking={toggleUserTracking} />
        )}

        {page === 'edoc-b2b' && selected && (
          <EDocHubB2B app={selected} onBack={onBack} onToggleActive={onToggleActive} users={usersForSelected} onAddUser={(data) => addUser('edoc-b2b', data)} onToggleUserTracking={toggleUserTracking} />
        )}
      </main>

      <footer className="site-footer">© eDoc Hub — Admin Panel</footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
