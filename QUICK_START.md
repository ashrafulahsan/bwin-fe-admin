# Quick Start Guide - Dynamic Admin Panel

## What Was Configured

✅ **Environment Variables** - API base URL configured for `http://127.0.0.1:8000/api/v1`
✅ **API Client** - Axios instance with automatic token injection and error handling
✅ **Response Interceptors** - Automatic token refresh on 401 errors
✅ **Services** - Example services for Auth and Users
✅ **React Query** - Optimized caching and state management
✅ **Auth State** - Zustand store with localStorage persistence
✅ **Custom Hooks** - Ready-to-use hooks for data fetching and mutations

## Starting the Admin Panel

### Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)
- Backend API running on `http://127.0.0.1:8000`

### Steps

1. **Verify API is running:**
   ```bash
   # In your backend directory (bwin_apis)
   python -m uvicorn app.main:app --reload
   ```
   The API should be running at: `http://127.0.0.1:8000`

2. **Start the admin panel:**
   ```bash
   cd bwin_fe_admin
   npm run dev
   ```
   The admin panel will be running at: `http://localhost:3000`

3. **Access the application:**
   Open `http://localhost:3000` in your browser

## Making API Calls

### Basic Pattern - Login Example

**Component:**
```javascript
"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginMutation = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginMutation.mutate({ email, password });
      // Login hook will automatically handle token storage
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email"
      />
      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        type="password"
        placeholder="Password"
      />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      {loginMutation.error && <p>{loginMutation.error.message}</p>}
    </form>
  );
}
```

### Fetching Data Example

```javascript
"use client";

import { useUsers } from "@/hooks/useApi";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useUsers({ page, limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Creating/Updating Data Example

```javascript
"use client";

import { useState } from "react";
import { useCreateUser } from "@/hooks/useApi";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const createMutation = useCreateUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutate(formData);
      // Form automatically clears and list refreshes via hook
      alert("User created successfully!");
    } catch (error) {
      alert("Error creating user: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="email"
        placeholder="Email"
        required
      />
      <input
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Creating..." : "Create User"}
      </button>
      {createMutation.error && (
        <p style={{ color: "red" }}>{createMutation.error.message}</p>
      )}
    </form>
  );
}
```

## File Structure

```
bwin_fe_admin/src/
├── services/
│   ├── apiClient.js          # ✅ Configured HTTP client
│   ├── authService.js        # ✅ Authentication endpoints
│   ├── usersService.js       # ✅ User management endpoints
│   └── apiUtils.js           # ✅ Utility functions
├── hooks/
│   └── useApi.js             # ✅ React Query hooks
├── store/
│   └── authStore.js          # ✅ Auth state management
├── providers/
│   ├── AuthProvider.jsx      # ✅ Auth hydration
│   └── QueryProvider.jsx     # ✅ React Query setup
├── constants/
│   └── constants.js          # ✅ Configuration constants
└── .env.local                # ✅ Environment variables
```

## Common Tasks

### Adding a New API Endpoint

1. Create service in `src/services/[feature]Service.js`
2. Add React Query hooks to `src/hooks/useApi.js`
3. Use hooks in your components

See `API_SETUP.md` for detailed instructions.

### Changing the API Base URL

Update `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://your-api-url:8000/api/v1
```

### Debugging API Calls

1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform an action
4. Check the request/response
5. The apiClient automatically logs errors to console

### Accessing Current User

```javascript
import { useAuthStore } from "@/store/authStore";

export function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

## Troubleshooting

### API Calls Failing
1. ✅ Check if backend is running: `http://127.0.0.1:8000`
2. ✅ Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
3. ✅ Check browser console for error messages
4. ✅ Verify API endpoints exist in backend

### Token/Authentication Issues
1. ✅ Clear browser localStorage: `localStorage.clear()`
2. ✅ Check token is stored: `localStorage.getItem('bwin_access_token')`
3. ✅ Verify refresh token endpoint exists in backend

### CORS Errors
1. ✅ Ensure backend has CORS enabled for `http://localhost:3000`
2. ✅ Backend should accept credentials in requests

## Next Steps

1. ✅ Start your backend API
2. ✅ Start the admin panel with `npm run dev`
3. ✅ Test login functionality
4. ✅ Start building your admin pages using the provided hooks and services
5. ✅ Extend services and hooks for your specific endpoints

## Support

For more detailed information, see:
- `API_SETUP.md` - Complete API configuration guide
- `src/services/` - Example services
- `src/hooks/useApi.js` - React Query hooks
