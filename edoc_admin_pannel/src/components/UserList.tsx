import { memo, useEffect, useState } from 'react';
import type { User } from '../data/mockUsers';

type Props = Readonly<{
  users: User[];
  onToggleTracking: (id: string) => void;
}>;

function formatTime(totalSeconds: number) {
  const s = Math.floor(totalSeconds % 60);
  const m = Math.floor((totalSeconds / 60) % 60);
  const h = Math.floor(totalSeconds / 3600);
  return `${h}h ${m}m ${s}s`;
}

function UserList({ users, onToggleTracking }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // for live updates while a user is being tracked
  const [now, setNow] = useState(() => Date.now());
  const [showMap, setShowMap] = useState<Record<string, boolean>>({});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const hasTracking = users.some((u) => u.isTracking);
    if (!hasTracking) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [users]);

  function toggleShow(id: string) {
    setShowMap((p) => ({ ...p, [id]: !p[id] }));
  }

  return (
    <div className="user-list">
      <h3>Users</h3>
      {users.length === 0 && <p className="muted">No users yet.</p>}
      <div className="user-rows">
        {paginatedUsers.map((u) => {
          const runningExtra = u.isTracking && u.trackingStart ? Math.floor((now - u.trackingStart) / 1000) : 0;
          const display = formatTime(u.totalSeconds + runningExtra);
          let loginLabel = 'B2B';
          if (u.authProvider === 'google') loginLabel = 'Google';
          else if (u.authProvider === 'phone') loginLabel = 'Phone';

          return (
            <div className="user-row" key={u.id}>
              <div>
                <div className="user-name">{u.name} <span className="muted">({u.location})</span></div>
                <div className="muted small">{u.ageGroup} • {u.gender}</div>
                <div className="muted small">Login: <strong>{loginLabel}</strong>
                  {u.authProvider === 'phone' && u.phone ? <span className="muted"> • {u.phone}</span> : null}
                  {u.authProvider === 'b2b' && (
                    <div className="b2b-cred">ID: <strong>{u.b2bId ?? '—'}</strong>
                      <div>Pass: <strong>{u.b2bPassword && !showMap[u.id] ? '••••••••' : u.b2bPassword ?? '—'}</strong></div>
                      <div>
                        <button className="btn btn-ghost" onClick={() => toggleShow(u.id)}>{showMap[u.id] ? 'Hide' : 'Show'}</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="user-actions">
                <div className="muted small">Time: <strong>{display}</strong></div>
                <button className="btn btn-ghost" onClick={() => onToggleTracking(u.id)}>
                  {u.isTracking ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button className="btn btn-ghost" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="muted">Page {currentPage} of {Math.ceil(users.length / itemsPerPage)}</span>
        <button className="btn btn-ghost" onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastItem >= users.length}>
          Next
        </button>
      </div>
    </div>
  );
}

export default memo(UserList);
