# Admin Panel Dynamic API Setup

This document explains how to use the newly configured API integration in the BWIN Admin Panel.

## Configuration

### Environment Variables
All API configuration is managed through environment variables defined in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
NEXT_PUBLIC_APP_NAME=BWIN Admin Panel
```

The `NEXT_PUBLIC_` prefix makes these variables available in the browser. Update the API base URL to match your backend configuration.

## Architecture

### API Client (`src/services/apiClient.js`)
The core HTTP client built on Axios with:
- **Base URL Configuration**: Automatically set from environment variables
- **Request Interceptor**: Automatically adds Bearer token to all requests
- **Response Interceptor**: Handles 401 errors with token refresh logic
- **Error Handling**: Standardized error responses for different HTTP status codes
- **Timeout**: 30-second default timeout for all requests

### Services

#### Authentication Service (`src/services/authService.js`)
Handles all authentication-related API calls:
```javascript
import { authService } from "@/services/authService";

// Login
const loginData = await authService.login(email, password);
// Returns: { access_token, refresh_token, user }

// Get current user
const userData = await authService.getCurrentUser();

// Logout
await authService.logout();

// Password reset
await authService.requestPasswordReset(email);
await authService.resetPassword({ token, new_password });
```

#### Users Service (`src/services/usersService.js`)
User management API calls:
```javascript
import { usersService } from "@/services/usersService";

// Get all users with pagination
const users = await usersService.getUsers({ page: 1, limit: 10, search: "john" });

// Get single user
const user = await usersService.getUserById(userId);

// Create user
const newUser = await usersService.createUser({ name, email, password });

// Update user
const updated = await usersService.updateUser(userId, { name, email });

// Delete user
await usersService.deleteUser(userId);

// Manage roles
await usersService.assignRoles(userId, [roleId1, roleId2]);

// Get user permissions
const permissions = await usersService.getUserPermissions(userId);
```

#### API Utils (`src/services/apiUtils.js`)
Utility functions for common API operations:
```javascript
import { handleApiError, normalizeResponse, uploadFile, downloadFile } from "@/services/apiUtils";

// Handle errors
try {
  // API call
} catch (error) {
  const { status, message, code } = handleApiError(error);
}

// Upload file
const formData = new FormData();
formData.append("file", file);
await uploadFile("/upload", formData, (event) => {
  console.log(`Progress: ${Math.round((event.loaded * 100) / event.total)}%`);
});

// Download file
const blob = await downloadFile("/export/users");
```

## React Query Hooks (`src/hooks/useApi.js`)

Pre-built hooks for common operations with automatic caching and state management:

### User Hooks
```javascript
import { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useApi";

// Fetch users with pagination
const { data, isLoading, error } = useUsers({ page: 1, limit: 10 });

// Fetch single user
const { data: user } = useUser(userId);

// Create user
const createUserMutation = useCreateUser();
await createUserMutation.mutate({ name, email, password });

// Update user
const updateUserMutation = useUpdateUser();
await updateUserMutation.mutate({ userId, data: { name, email } });

// Delete user
const deleteUserMutation = useDeleteUser();
await deleteUserMutation.mutate(userId);
```

### Auth Hooks
```javascript
import { useLogin, useLogout, useCurrentUser } from "@/hooks/useApi";

// Login
const loginMutation = useLogin();
await loginMutation.mutate({ email, password });

// Logout
const logoutMutation = useLogout();
await logoutMutation.mutate();

// Get current user
const { data: currentUser } = useCurrentUser();
```

## State Management

### Auth Store (`src/store/authStore.js`)
Uses Zustand for lightweight state management:
```javascript
import { useAuthStore } from "@/store/authStore";

const { user, accessToken, isAuthenticated, setUser, setAccessToken, logout } = useAuthStore();
```

### Token Management
- Access token stored in `localStorage` under key `bwin_access_token`
- Refresh token stored in `localStorage` under key `bwin_refresh_token`
- Tokens automatically included in all request headers via interceptor
- Automatic token refresh on 401 responses

## Creating a New API Service

Follow this pattern to create new services:

```javascript
// src/services/[feature]Service.js
import { apiClient } from "./apiClient";

export const featureService = {
  // GET endpoint
  getItems: async (params) => {
    const response = await apiClient.get("/feature", { params });
    return response.data;
  },

  // GET with ID
  getItemById: async (id) => {
    const response = await apiClient.get(`/feature/${id}`);
    return response.data;
  },

  // POST - Create
  createItem: async (data) => {
    const response = await apiClient.post("/feature", data);
    return response.data;
  },

  // PUT - Update
  updateItem: async (id, data) => {
    const response = await apiClient.put(`/feature/${id}`, data);
    return response.data;
  },

  // DELETE
  deleteItem: async (id) => {
    const response = await apiClient.delete(`/feature/${id}`);
    return response.data;
  },
};
```

## Creating Custom Hooks

For new services, create corresponding React Query hooks:

```javascript
// Add to src/hooks/useApi.js or create new file

export const useFeatureItems = (params, enabled = true) => {
  return useQuery({
    queryKey: ["feature", params],
    queryFn: () => featureService.getItems(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateFeatureItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => featureService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature"] });
    },
  });
};
```

## Example Usage in Components

```javascript
"use client";

import { useUsers } from "@/hooks/useApi";

export default function UsersPage() {
  const { data, isLoading, error } = useUsers({ page: 1, limit: 10 });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Providers Setup

The app is wrapped with necessary providers in `src/app/layout.js`:
- **AuthProvider**: Hydrates auth state from localStorage on mount
- **QueryProvider**: Configures React Query with optimized settings

## Error Handling

The API client automatically handles:
- **401 Unauthorized**: Attempts token refresh, redirects to login if failed
- **403 Forbidden**: Logs access denied message
- **404 Not Found**: Logs resource not found
- **5xx Server Errors**: Logs server errors

All errors follow this structure:
```javascript
{
  status: 401,
  message: "Unauthorized",
  data: { /* API error response */ },
  code: "UNAUTHORIZED"
}
```

## Next Steps

1. ✅ Environment variables configured
2. ✅ API client set up with interceptors
3. ✅ Example services created (auth, users)
4. ✅ React Query hooks provided
5. ✅ Auth state management configured

Now you can:
- Create new API services following the pattern
- Add custom React Query hooks for new endpoints
- Build UI components using the provided hooks
- Extend the interceptors with additional logic as needed

## Testing the Setup

To verify everything works:

1. Start your backend API: `python -m uvicorn app.main:app --reload`
2. Start the admin panel: `npm run dev`
3. Try logging in or fetching data using the configured services

All API calls will automatically use the configured base URL and include authentication headers.
