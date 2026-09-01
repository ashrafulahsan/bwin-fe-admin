# BWIN Admin Panel

Admin frontend for the BWIN Consultants CMS + LMS platform.

- **Framework:** Next.js (App Router), JavaScript, Tailwind CSS
- **Backend:** FastAPI, consumed over HTTP
- **State:** Zustand (client) + TanStack Query (server)
- **Forms:** React Hook Form + Zod
- **Auth:** JWT + refresh token, RBAC (Super Admin, Admin, Instructor)

For folder structure, module conventions, and coding rules, see [CLAUDE.md](./CLAUDE.md) — that file is the source of truth for architecture and must be followed for all new code.

## Getting Started

### 1. Start the backend

```bash
cd bwin_apis
.venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

Runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`). Backend CORS must allow `http://localhost:3000`.

### 2. Configure environment

Copy `.env.example` to `.env.local` if it doesn't already exist:

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_APP_NAME=BWIN Admin Panel
```

Restart the dev server after any change to `.env.local`.

### 3. Start the admin panel

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Integration

### Architecture

```
Component → React Query hook (src/hooks/useApi.js or module hooks)
          → Service layer (src/services/*, module services/)
          → apiClient (Axios, src/services/apiClient.js)
          → Backend API (NEXT_PUBLIC_API_BASE_URL)
```

- **`src/services/apiClient.js`** — Axios instance, 30s timeout. Request interceptor adds `Authorization: Bearer <token>`; response interceptor retries once via `POST /auth/refresh` on 401, otherwise logs 403/404/5xx and clears auth on refresh failure.
- **`src/services/authService.js`** — `login`, `register`, `logout`, `getCurrentUser`, `refreshToken`, `requestPasswordReset`, `resetPassword`.
- **`src/services/usersService.js`** — `getUsers`, `getUserById`, `createUser`, `updateUser`, `deleteUser`, `assignRoles`, `getUserPermissions`. Use as the template for new feature services.
- **`src/services/apiUtils.js`** — `handleApiError(error)` (normalizes to `{status, message, data, code}`), `normalizeResponse`, `buildQueryString`, `uploadFile(url, formData, onProgress)`, `downloadFile(url)`.
- **`src/hooks/useApi.js`** — React Query hooks (`useUsers`, `useUser`, `useCreateUser`, `useUpdateUser`, `useDeleteUser`, `useLogin`, `useLogout`, `useCurrentUser`) with loading/error states and cache invalidation on mutation.
- **`src/store/authStore.js`** — Zustand store: `user`, `accessToken`, `isAuthenticated`, `setUser()`, `setAccessToken()`, `logout()`.
- **`src/providers/AuthProvider.jsx`** — hydrates auth state from `localStorage` on app load. **`src/providers/QueryProvider.jsx`** — React Query client config (5 min stale time, 10 min cache/gc time, retry + refetch-on-focus defaults).
- **`middleware.js`** (root) — placeholder for server-side route protection; currently passes through, auth is enforced client-side in `DashboardLayout`.

All API calls must go through `services/` — never call `fetch`/`axios` directly from components.

### Adding a new API endpoint

```javascript
// src/services/featureService.js
import { apiClient } from "./apiClient";

export const featureService = {
  getItems: async (params) => (await apiClient.get("/feature", { params })).data,
  createItem: async (data) => (await apiClient.post("/feature", data)).data,
};

// src/hooks/useApi.js
export const useFeatureItems = (params) =>
  useQuery({ queryKey: ["feature", params], queryFn: () => featureService.getItems(params) });
```

### Auth flow

Login form → `useLogin()` → auth service → `POST /auth/login` → tokens + user stored in `localStorage` (`bwin_access_token`, `bwin_refresh_token`) and Zustand → redirect to `/dashboard`. `DashboardLayout` guards all dashboard routes and redirects to `/login` if no token is present.

**Test credentials (local dev backend):**
```
Email:    superadmin@bwin.example.com
Password: BwinDemo#2026
Role:     Admin
```

### Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot POST /auth/login` | Backend not running, or wrong URL in `.env.local` |
| CORS error | Backend must allow `http://localhost:3000` in CORS config |
| Redirect loop / stuck on login | `localStorage.clear()` in browser console, then retry |
| Env var not picking up | Restart `npm run dev` after editing `.env.local` |
| Check auth state | Console: `useAuthStore.getState()` (import from `@/store/authStore`) |
| Inspect token | Console: `JSON.parse(atob(localStorage.getItem('bwin_access_token').split('.')[1]))` |

## Toast Notifications

Global toast system is already wired into `src/app/layout.js` — no setup needed, just use the hook.

```jsx
"use client";
import { useToast } from "@/hooks/useToast";

export default function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo, showFailed } = useToast();

  const handleSave = async () => {
    try {
      await api.save(data);
      showSuccess("Saved successfully!");
    } catch (error) {
      showError(error.message || "Failed to save");
    }
  };
}
```

- Types: `success` (5s), `error` (7s), `warning` (6s), `info` (5s), `failed` (7s) — durations configurable via `{ duration: ms }` (`0` = manual close only).
- Options: `showX(message, { title, duration })`; also `showToast(type, message, options)`, `clearToasts()`, `removeToast(id)`.
- Position is set on `<ToastProvider position={...}>` in `src/app/layout.js` (`TOAST_POSITIONS` from `@/constants/toastTypes`).
- Use the right type for context: `warning` for validation, `error` for system/server failures, `failed` for a specific user action failing (e.g. payment declined), `success`/`info` otherwise. Always pass a specific message (extract from `error.response?.data?.message` when available), not a generic one.
- Files: `src/context/ToastContext.jsx` (provider/state), `src/hooks/useToast.js` (hook), `src/components/ui/Toast*.jsx` (rendering), `src/constants/toastTypes.js` (config), `src/utils/toastHelpers.js` (helpers). See `TOAST_CRUD_EXAMPLES.jsx` for copy-paste patterns (create/update/delete/upload/multi-step forms).
- Behavior included: duplicate-message suppression within 1s, pause-on-hover, max 5 visible at once, WCAG 2.1 AA (ARIA live regions, keyboard nav, icon+color coding).

## Production Hardening Notes

Current implementation is dev-appropriate (tokens in `localStorage`). Before a production launch:

- Serve everything over HTTPS.
- Consider moving tokens to HttpOnly cookies (requires a backend change) instead of `localStorage`.
- Add CSRF protection if switching to cookie-based auth.
- Add rate limiting and failed-login monitoring on the backend `/auth/login` endpoint.
- Keep the password-reset flow (`authService.requestPasswordReset` / `resetPassword`) wired to real email delivery before launch.
