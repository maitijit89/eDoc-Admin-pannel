import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/useAuth';

// This component implements Google Identity Services client-side sign-in.
// Set VITE_GOOGLE_CLIENT_ID in a .env file or enter a Client ID in the field below.

function loadGIS() {
  return new Promise<void>((resolve) => {
    if ((globalThis as unknown as { google?: { accounts?: unknown } })?.google?.accounts) return resolve();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

export default function SignIn() {
  const { setUser } = useAuth();
  const [clientId, setClientId] = useState<string>(() => {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID ?? (localStorage.getItem('admin.google.clientId') ?? '');
  });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!clientId) return;
      await loadGIS();
      type GoogleAccountsId = {
        initialize: (opts: { client_id: string; callback: (res: CredentialResponse) => void | Promise<void>; ux_mode?: string }) => void;
        renderButton: (el: Element | null, opts: { type?: string; theme?: string; size?: string }) => void;
      };

      const google = (globalThis as unknown as { google?: { accounts?: { id?: GoogleAccountsId } } }).google;
      if (!google?.accounts?.id) {
        setError('Google Identity library failed to load.');
        return;
      }

      type CredentialResponse = { credential?: string };

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (res: CredentialResponse) => {
          // res.credential is the ID token (JWT)
          try {
            const idToken = String(res.credential ?? '');
            // verify token with Google's tokeninfo endpoint
            const r = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
            if (!r.ok) throw new Error('Token verification failed');
            const payload = await r.json();
            // check aud matches client id
            if (payload.aud !== clientId) throw new Error('Token aud mismatch');
            // optionally check email_verified
            if (!payload.email_verified) throw new Error('Email not verified');
            setUser({ id: String(payload.sub), email: String(payload.email), name: payload.name, picture: payload.picture, idToken });
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message || 'Sign-in failed');
          }
        },
        ux_mode: 'popup',
      });

      google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
      });
    }

    init();
  }, [clientId, setUser]);

  function saveClientId() {
    localStorage.setItem('admin.google.clientId', clientId);
    setError(null);
    // reload by updating clientId state triggers effect
    setClientId((v) => v);
  }

  return (
    <div className="sign-in-page">
      <h2>Admin sign in</h2>
      <p className="muted">Sign in with your Google account to access the admin panel.</p>

      <div className="panel">
        <label htmlFor="clientId">Google OAuth Client ID</label>
        <input id="clientId" placeholder="VITE_GOOGLE_CLIENT_ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
        <div className="form-actions">
          <button className="btn" onClick={saveClientId}>Save Client ID</button>
        </div>
        <p className="muted small">If you don't have one, create a Google OAuth Client (Type: Web) and add your origin (e.g. http://localhost:5173) to the authorized JavaScript origins.</p>
      </div>

      <div className="panel">
        <div ref={containerRef} />
        {error && <p className="muted error-text">{error}</p>}
      </div>

      <div className="panel">
        <h4>Security note</h4>
        <p className="muted">This implementation verifies the ID token using Google tokeninfo endpoint client-side for convenience. For production you should verify ID tokens on a server (to ensure token provenance) and issue a session cookie or JWT from a trusted backend.</p>
      </div>
    </div>
  );
}
