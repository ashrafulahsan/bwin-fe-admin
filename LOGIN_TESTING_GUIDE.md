# Login Implementation - Testing Guide

## ✅ Login Functionality Configured

The login system is now fully integrated with your backend API. Here's what was implemented:

### Changes Made

1. **Login Service** (`src/modules/auth/services/index.js`)
   - ✅ Now calls real API endpoint: `POST /auth/login`
   - ✅ Handles response mapping (access_token → accessToken)
   - ✅ Extracts user, accessToken, and refreshToken

2. **Auth Store** (`src/store/authStore.js`)
   - ✅ Stores user data and access token
   - ✅ Tracks authentication status

3. **API Client** (`src/services/apiClient.js`)
   - ✅ Request interceptor adds Bearer token to all requests
   - ✅ Response interceptor handles 401 errors with token refresh
   - ✅ Auto-refresh at: `POST /auth/refresh`

4. **Dashboard Protection** (`src/layouts/DashboardLayout.jsx`)
   - ✅ Checks authentication on mount
   - ✅ Redirects to login if not authenticated
   - ✅ Shows loading message while checking auth

5. **Auth Provider** (`src/providers/AuthProvider.jsx`)
   - ✅ Hydrates auth state from localStorage on app load
   - ✅ Decodes JWT to extract user info

## 🧪 Test Login Now

### Step 1: Access Login Page
Open browser: `http://localhost:3000/login`

You should see:
- BWIN Consultants logo
- "Staff access" label
- Role tabs: Admin | Instructor
- Email/Phone input field
- Password input field with Show/Hide button
- Remember me checkbox
- Forgot password link
- Sign in button

### Step 2: Enter Credentials
**Super Admin Account:**
- **Email:** `superadmin@bwin.example.com`
- **Password:** `BwinDemo#2026`

**Role Selection:**
- Select the **Admin** tab (for super admin access)

### Step 3: Submit Login Form
Click "Sign in as admin" button

**Expected Result:**
- ✅ Loading spinner appears on button
- ✅ Button text changes to "Signing in..."
- ✅ Redirect to `/dashboard` (after ~1-2 seconds)
- ✅ Dashboard loads with sidebar and header

### Step 4: Verify Success
Check the following:

1. **Browser DevTools - Storage**
   - Open: F12 → Application → Local Storage
   - Should see: `bwin_access_token` = (JWT token)
   - Should see: `bwin_refresh_token` = (refresh token)

2. **Browser DevTools - Network**
   - Look for POST request to `/api/v1/auth/login`
   - Response should contain: access_token, refresh_token, user

3. **User Info**
   - Check header/profile section
   - Should display: Logged-in user name/email

4. **Page Refresh**
   - Refresh the page (F5)
   - Should stay on dashboard (auth state persisted from localStorage)
   - Should NOT redirect to login

## 🔄 Token Refresh Flow

The API client automatically handles token refresh:

1. When access token expires (401 response)
2. Automatically makes request to `/auth/refresh` endpoint
3. Sends current refresh_token
4. Gets new access_token
5. Retries original request
6. If refresh fails → Redirects to login

**Testing token refresh:**
1. Wait for token to expire (or manually modify token in DevTools)
2. Make any API request
3. Should automatically refresh and succeed
4. No user action required

## 🔐 Logout Testing

To test logout (when implemented):

```javascript
// In browser console (F12)
localStorage.clear();
// Then refresh page or navigate to /login
```

## ⚠️ Troubleshooting

### "Cannot POST /auth/login"
**Problem:** Backend not running or wrong endpoint
**Solution:**
1. Verify backend is running: `http://127.0.0.1:8000`
2. Check endpoint exists: Visit `http://127.0.0.1:8000/api/v1/docs`
3. Verify `.env.local` has: `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1`

### "Invalid credentials" or "401 Unauthorized"
**Problem:** Wrong email/password or backend validation error
**Solution:**
1. Verify credentials: `superadmin@bwin.example.com` / `BwinDemo#2026`
2. Check backend logs for detailed error
3. Ensure backend user exists with these credentials

### "Token not persisting"
**Problem:** Token not stored after login
**Solution:**
1. Check localStorage: Open DevTools → Application → Local Storage
2. Verify token key: `bwin_access_token`
3. Check if cookies are enabled in browser
4. Try clearing cache: `localStorage.clear()` in console

### "Redirect loop" between login and dashboard
**Problem:** Auth state not syncing properly
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Clear browser cache: Ctrl+Shift+Del
3. Restart dev server: Kill and restart `npm run dev`

### "CORS Error"
**Problem:** Backend doesn't allow requests from localhost:3000
**Solution:**
1. Check backend CORS configuration
2. Ensure CORS middleware allows: `http://localhost:3000`
3. Backend may need: `origins = ["http://localhost:3000"]`

## 📋 Login Flow Diagram

```
User Enters Credentials
        ↓
Click "Sign in as admin"
        ↓
LoginForm validates input (Zod schema)
        ↓
useLogin hook mutates with: { role, identifier, password, remember }
        ↓
login() service called
        ↓
API Client POST /auth/login
        ↓
Request Interceptor adds: Authorization: Bearer (token if exists)
        ↓
Backend validates credentials
        ↓
Returns: { access_token, refresh_token, user, ... }
        ↓
Service maps response to: { accessToken, refreshToken, user }
        ↓
useLogin hook onSuccess:
  - Store accessToken in localStorage
  - Store refreshToken in localStorage
  - Update Zustand auth store
        ↓
LoginForm catches success
        ↓
router.push(/dashboard)
        ↓
DashboardLayout checks token
        ↓
Token found → Show dashboard
        ↓
AuthProvider hydrates user from token
        ↓
Dashboard renders with user info
```

## 🛠️ Manual API Testing (curl)

Test login endpoint directly:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@bwin.example.com",
    "password": "BwinDemo#2026",
    "role": "admin",
    "remember": true
  }'
```

Expected response:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "superadmin@bwin.example.com",
    "name": "Super Admin",
    "role": "super_admin"
  }
}
```

## 📊 Implementation Status

| Feature | Status | Details |
|---------|--------|---------|
| Login Form | ✅ Complete | Role tabs, validation, styling |
| Auth Service | ✅ Complete | Calls real API endpoint |
| Token Storage | ✅ Complete | localStorage with keys |
| API Auth Headers | ✅ Complete | Bearer token injection |
| Token Refresh | ✅ Complete | Auto-refresh on 401 |
| Auth State | ✅ Complete | Zustand store sync |
| Dashboard Guard | ✅ Complete | Redirect to login if not auth |
| Auth Hydration | ✅ Complete | Restores state on app load |

## 🎯 Next Steps

1. ✅ Test login with super admin credentials
2. ✅ Verify token storage in localStorage
3. ✅ Check dashboard loads after login
4. ✅ Test page refresh (should stay logged in)
5. ✅ Test manual token refresh
6. ⏭️ Implement logout
7. ⏭️ Implement social login
8. ⏭️ Implement password reset

## 📞 Important API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/me` | GET | Get current user info |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Reset password with token |

## 🔍 Debug Commands (Console)

```javascript
// Check token
localStorage.getItem('bwin_access_token')

// Check auth store
import { useAuthStore } from '@/store/authStore';
useAuthStore.getState()

// Check if authenticated
localStorage.getItem('bwin_access_token') ? 'Logged in' : 'Not logged in'

// Manual logout
localStorage.clear()

// Decode JWT (in console)
JSON.parse(atob(localStorage.getItem('bwin_access_token').split('.')[1]))
```

---

**Status:** ✅ Login system ready for testing!

Start from: `http://localhost:3000/login`
