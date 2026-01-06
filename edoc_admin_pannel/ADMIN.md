# Admin Pages

This project now includes a minimal Admin Dashboard for managing the two apps:

- **eDoc Hub** (`eDoc Hub`)  
- **eDoc Hub B2B** (`eDoc Hub B2B`)

How to run

1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Open the app (usually `http://localhost:5173`) and use the top navigation to switch to the Admin panels or click `Manage` on the Dashboard.

What was added

- `src/App.tsx` — top-level layout and simple navigation
- `src/pages/AdminDashboard.tsx` — dashboard listing apps
- `src/pages/eDocHub.tsx` — app-specific admin page
- `src/pages/eDocHubB2B.tsx` — B2B admin page
- `src/components/AppCard.tsx` — reusable card UI
- `src/data/mockApps.ts` — demo/mock data
- `src/styles/admin.css` — basic styles
- User/time tracking: `src/data/mockUsers.ts`, `src/components/UserForm.tsx`, `src/components/UserList.tsx` — add and track user sessions per app (demo, persisted to localStorage)
- Authentication details: users now include `authProvider` (Google, Phone, or B2B). B2B users get a generated 6-digit `b2bId` and 8-character `b2bPassword` when created; admins can regenerate credentials from the B2B admin page.

## Admin sign-in (Google OAuth)

This project supports a real Google OAuth sign-in for admins using Google Identity Services (client-side). To enable it:

1. Create a Google Cloud project and an OAuth 2.0 Client ID (type: Web). Add your origin (e.g. `http://localhost:5173`) to authorized JavaScript origins.
2. Set the client ID in your environment: create a file named `.env` at the project root and add:

```ini
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

3. Start the dev server, open the app and go to the sign-in screen. You can also enter a Client ID in the admin sign-in page for local testing.

Security note: this demo verifies ID tokens client-side using Google's `tokeninfo` endpoint. For production, you should verify ID tokens on a trusted server and issue your own session cookie/JWT for admin sessions.
This is a minimal, demo-friendly admin UI meant as a starting point. Let me know which management features you want (user management, metrics, logs, settings, role-based access, etc.) and I will extend it.