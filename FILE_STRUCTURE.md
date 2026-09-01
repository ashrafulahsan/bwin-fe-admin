# 📁 Admin Panel Structure - Complete File Overview

## Project Root Files

```
bwin_fe_admin/
├── .env.local ✅ NEW
│   └── API_BASE_URL configuration
│
├── .env.example ✅ NEW
│   └── Template for environment setup
│
├── README_SETUP.md ✅ NEW
│   └── Executive summary & quick overview
│
├── QUICK_START.md ✅ NEW
│   └── Get started in 5 minutes
│
├── API_SETUP.md ✅ NEW
│   └── Complete technical documentation
│
├── SETUP_SUMMARY.md ✅ NEW
│   └── Detailed checklist of all changes
│
├── VERIFICATION_CHECKLIST.md ✅ NEW
│   └── Pre-launch verification steps
│
├── package.json (dependencies already included)
├── next.config.mjs
├── jsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

## Source Code Structure

```
src/
│
├── app/
│   ├── layout.js ✅ ENHANCED
│   │   └── Wraps app with QueryProvider & AuthProvider
│   ├── (auth)/
│   ├── (dashboard)/
│   └── globals.css
│
├── services/ ✅ CORE LAYER
│   ├── apiClient.js ✅ ENHANCED
│   │   ├── Axios instance
│   │   ├── Request interceptor (adds Bearer token)
│   │   ├── Response interceptor (handles 401, 403, etc.)
│   │   └── Token refresh logic
│   │
│   ├── authService.js ✅ NEW
│   │   ├── login()
│   │   ├── register()
│   │   ├── logout()
│   │   ├── getCurrentUser()
│   │   ├── refreshToken()
│   │   ├── requestPasswordReset()
│   │   └── resetPassword()
│   │
│   ├── usersService.js ✅ NEW
│   │   ├── getUsers()
│   │   ├── getUserById()
│   │   ├── createUser()
│   │   ├── updateUser()
│   │   ├── deleteUser()
│   │   ├── assignRoles()
│   │   └── getUserPermissions()
│   │
│   └── apiUtils.js ✅ NEW
│       ├── handleApiError()
│       ├── normalizeResponse()
│       ├── buildQueryString()
│       ├── downloadFile()
│       └── uploadFile()
│
├── hooks/ ✅ REACT QUERY LAYER
│   ├── useApi.js ✅ NEW
│   │   ├── useUsers()
│   │   ├── useUser()
│   │   ├── useCreateUser()
│   │   ├── useUpdateUser()
│   │   ├── useDeleteUser()
│   │   ├── useLogin()
│   │   ├── useLogout()
│   │   └── useCurrentUser()
│   │
│   └── useResponsiveSidebar.js
│
├── store/ ✅ STATE MANAGEMENT
│   ├── authStore.js
│   │   ├── user (state)
│   │   ├── accessToken (state)
│   │   ├── isAuthenticated (state)
│   │   ├── setUser() (action)
│   │   ├── setAccessToken() (action)
│   │   └── logout() (action)
│   │
│   ├── appStore.js
│   └── settingsStore.js
│
├── providers/ ✅ WRAPPER LAYER
│   ├── AuthProvider.jsx ✅ ENHANCED
│   │   └── Hydrates auth state from localStorage on mount
│   │
│   └── QueryProvider.jsx ✅ ENHANCED
│       ├── QueryClient with optimized config
│       ├── 5-minute stale time
│       ├── 10-minute cache time
│       ├── Retry logic
│       └── Error handling
│
├── constants/
│   └── constants.js
│       ├── APP_NAME
│       ├── API_BASE_URL (from env)
│       ├── TOKEN_STORAGE_KEY
│       └── REFRESH_TOKEN_STORAGE_KEY
│
├── config/
│   ├── routes.js
│   ├── permissions.js
│   └── sidebar.js
│
├── context/
│   └── index.js
│
├── lib/
│   └── (utility functions)
│
├── layouts/
│   └── (layout components)
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── courses/
│   ├── ...
│   └── (feature modules)
│
├── components/
│   └── (reusable components)
│
├── styles/
│   └── (CSS modules/styles)
│
├── utils/
│   └── (helper utilities)
│
└── (other folders)
    └── (as configured)
```

## Dependencies (Already Installed)

```json
{
  "axios": "^1.19.0",
  "@tanstack/react-query": "^5.102.3",
  "zustand": "^5.0.15",
  "react-hook-form": "^7.86.0",
  "@hookform/resolvers": "^5.9.1",
  "zod": "^4.4.3",
  "react": "19.2.8",
  "react-dom": "19.2.8",
  "next": "16.3.2"
}
```

All packages are ready to use! ✅

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Component                          │
│           (e.g., UsersPage, LoginForm, etc.)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              React Query Hook                                │
│  (useUsers, useCreateUser, useLogin, etc.)                   │
│                                                               │
│  Features:                                                   │
│  - Auto caching (5 min)                                     │
│  - Loading states                                           │
│  - Error handling                                           │
│  - Auto-refresh                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Service Layer                                   │
│  (authService, usersService, etc.)                          │
│                                                               │
│  Business logic for:                                        │
│  - API endpoint construction                               │
│  - Request/response handling                               │
│  - Data transformation                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              API Client (apiClient.js)                      │
│                                                               │
│  REQUEST INTERCEPTOR:                                       │
│  - Add Bearer token                                        │
│  - Set Content-Type                                        │
│                                                               │
│  RESPONSE INTERCEPTOR:                                      │
│  - Handle 401 → Refresh token                              │
│  - Handle 403 → Log forbidden                              │
│  - Handle 404 → Log not found                              │
│  - Handle 5xx → Log server error                           │
│                                                               │
│  FEATURES:                                                  │
│  - Base URL: http://127.0.0.1:8000/api/v1                 │
│  - Timeout: 30 seconds                                     │
│  - Default headers configured                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend API                                     │
│   http://127.0.0.1:8000/api/v1                             │
│                                                               │
│  Available endpoints:                                       │
│  - POST   /auth/login                                      │
│  - POST   /auth/logout                                     │
│  - POST   /auth/refresh                                    │
│  - GET    /auth/me                                         │
│  - GET    /users                                           │
│  - POST   /users                                           │
│  - PUT    /users/{id}                                      │
│  - DELETE /users/{id}                                      │
│  - ... (and all your other endpoints)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Database / Backend Logic                       │
│           (FastAPI, SQLAlchemy, etc.)                       │
└─────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────┐
│  Auth Store (Zustand)                   │
│  src/store/authStore.js                 │
│                                          │
│  State:                                  │
│  - user: { id, name, email, role }     │
│  - accessToken: "eyJhbGci..."          │
│  - isAuthenticated: boolean             │
│                                          │
│  Actions:                                │
│  - setUser()                            │
│  - setAccessToken()                    │
│  - logout()                             │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│  Auth Provider (React Context)          │
│  src/providers/AuthProvider.jsx         │
│                                          │
│  On Mount:                              │
│  - Read token from localStorage         │
│  - Decode JWT                          │
│  - Set user in store                   │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│  localStorage                           │
│  Browser Storage                        │
│                                          │
│  Stores:                                │
│  - bwin_access_token                   │
│  - bwin_refresh_token                  │
└─────────────────────────────────────────┘
```

## React Query Cache Flow

```
Component Request
    ↓
Query Cache Check
    ↓ (hit)                               ↓ (miss or stale)
Return Cached Data             Make API Request
    ↓                                      ↓
Component Renders                  API Response Received
(Instantly)                                ↓
    ↓                             Update Cache
Background Refetch                         ↓
(if stale > 5 min)            Component Renders
    ↓                             (With new data)
Update Cache & Re-render
    ↓
After 10 min inactivity
    ↓
Cache Garbage Collected
```

## Token Flow

```
User Logs In
    ↓
Login Request → Backend
    ↓
Backend Returns: access_token, refresh_token
    ↓
AuthProvider Stores in localStorage:
    - bwin_access_token
    - bwin_refresh_token
    ↓
setAccessToken() in Auth Store
    ↓
API Request Interceptor Adds:
    Authorization: Bearer ${token}
    ↓
All Subsequent Requests Include Token
    ↓
If 401 Response:
    ↓
Try Token Refresh:
    POST /auth/refresh { refresh_token }
    ↓ (Success)                    ↓ (Failure)
Store New Token                  Clear Tokens
Retry Original Request            Redirect to Login
    ↓
Request Succeeds
```

## Component Integration Example

```
┌─ User Dashboard (Component)
│
├─ Imports:
│  ├─ useUsers from @/hooks/useApi
│  ├─ useAuthStore from @/store/authStore
│  └─ usersService from @/services/usersService
│
├─ Renders:
│  ├─ User table with data from useUsers()
│  ├─ Current user info from useAuthStore()
│  ├─ Create user button with useCreateUser()
│  ├─ Update user form with useUpdateUser()
│  └─ Delete user confirmation with useDeleteUser()
│
└─ Handles:
   ├─ Loading states
   ├─ Error messages
   ├─ Success notifications
   └─ Cache invalidation
```

## Setup Readiness Checklist

```
✅ Services Layer
   ✅ API Client with interceptors
   ✅ Auth Service
   ✅ Users Service
   ✅ API Utils

✅ State Management
   ✅ Zustand Auth Store
   ✅ Token persistence
   ✅ Auth hydration

✅ React Query
   ✅ Query Provider configured
   ✅ Caching optimized
   ✅ Error handling setup

✅ Custom Hooks
   ✅ Auth hooks (login, logout)
   ✅ User hooks (CRUD)
   ✅ Query hooks with caching

✅ Configuration
   ✅ Environment variables
   ✅ Constants exported
   ✅ Providers initialized

✅ Documentation
   ✅ QUICK_START.md
   ✅ API_SETUP.md
   ✅ SETUP_SUMMARY.md
   ✅ VERIFICATION_CHECKLIST.md
   ✅ README_SETUP.md
   ✅ This file structure guide
```

## Usage Summary

```
To Fetch Data:
  import { useUsers } from "@/hooks/useApi";
  const { data, isLoading, error } = useUsers();

To Make Direct Calls:
  import { authService } from "@/services/authService";
  const user = await authService.getCurrentUser();

To Access Auth State:
  import { useAuthStore } from "@/store/authStore";
  const { user, isAuthenticated } = useAuthStore();

To Make API Calls:
  import { apiClient } from "@/services/apiClient";
  await apiClient.post("/endpoint", data);

To Upload Files:
  import { uploadFile } from "@/services/apiUtils";
  await uploadFile("/upload", formData);

To Handle Errors:
  import { handleApiError } from "@/services/apiUtils";
  const error = handleApiError(err);
```

## File Summary

| File | Lines | Purpose |
|------|-------|---------|
| apiClient.js | ~80 | Axios with interceptors |
| authService.js | ~70 | Auth endpoints |
| usersService.js | ~60 | User management |
| apiUtils.js | ~100 | Utility functions |
| useApi.js | ~150 | React Query hooks |
| QueryProvider.jsx | ~30 | React Query setup |
| AuthProvider.jsx | ~30 | Auth hydration |
| .env.local | ~2 | Environment config |

**Total: ~450 lines of production-ready code** 🚀

---

Everything is in place and ready for you to start building your admin panel!
