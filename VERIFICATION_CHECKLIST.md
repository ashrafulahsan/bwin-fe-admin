# ✅ Admin Panel Dynamic Setup - Verification Checklist

Use this checklist to verify that all configurations are working correctly.

## Pre-Launch Verification

### Environment Setup
- [ ] `.env.local` file exists in `bwin_fe_admin/` root directory
- [ ] Contains `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1`
- [ ] `.env.example` file exists as reference
- [ ] Node modules installed: `npm install` completed

### Backend Ready
- [ ] Backend API server is running on `http://127.0.0.1:8000`
- [ ] You can access: `http://127.0.0.1:8000/docs` (Swagger docs)
- [ ] CORS is enabled for `http://localhost:3000`
- [ ] Database migrations are up to date

### Code Structure
- [ ] `src/services/apiClient.js` - Enhanced with interceptors
- [ ] `src/services/authService.js` - Created with auth endpoints
- [ ] `src/services/usersService.js` - Created with user endpoints
- [ ] `src/services/apiUtils.js` - Created with utilities
- [ ] `src/hooks/useApi.js` - Created with React Query hooks
- [ ] `src/providers/QueryProvider.jsx` - Enhanced with config
- [ ] `src/providers/AuthProvider.jsx` - Enhanced with auth hydration
- [ ] `src/store/authStore.js` - Zustand store configured
- [ ] `src/app/layout.js` - Has QueryProvider and AuthProvider

## Launch Steps

### Step 1: Start Backend
```bash
cd bwin_apis
.venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

**Verify:**
- [ ] Terminal shows: `Uvicorn running on http://127.0.0.1:8000`
- [ ] No errors in startup logs
- [ ] Can access `http://127.0.0.1:8000/docs`

### Step 2: Start Admin Panel
```bash
cd bwin_fe_admin
npm run dev
```

**Verify:**
- [ ] Terminal shows: `Local: http://localhost:3000`
- [ ] No errors in build
- [ ] No errors in terminal

### Step 3: Open Browser
Navigate to: `http://localhost:3000`

**Verify:**
- [ ] Page loads without errors
- [ ] Browser DevTools console is clean (no errors)
- [ ] Responsive design loads correctly

## Functionality Tests

### Test 1: Authentication Flow
**If you have a login page:**
- [ ] Can see login form
- [ ] Enter credentials and submit
- [ ] In DevTools Network tab, verify POST request to `/api/v1/auth/login`
- [ ] Check localStorage for `bwin_access_token`
- [ ] Check localStorage for `bwin_refresh_token`
- [ ] Successfully redirected to dashboard

**If login page not ready:**
- [ ] Manually test with curl:
  ```bash
  curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"password"}'
  ```

### Test 2: API Client Configuration
Check browser DevTools Console:
```javascript
// Paste in DevTools Console:
console.log(localStorage.getItem('bwin_access_token') ? 'Token stored ✅' : 'No token ❌');
```

**Verify:**
- [ ] Output shows 'Token stored ✅' after login

### Test 3: Request Headers
In DevTools Network tab, click any API request and check Headers:
- [ ] Authorization header present: `Bearer [token]`
- [ ] Content-Type: `application/json`

### Test 4: React Query Caching
If you have a data-fetching component:
- [ ] First load fetches from API (Network tab shows request)
- [ ] Second load uses cache (no new request)
- [ ] After 5 minutes (stale time), it refetches

## Debugging Tools

### Access the API Client in Console
```javascript
// In browser DevTools Console:
import { apiClient } from '@/services/apiClient';

// Test a simple API call
apiClient.get('/users')
  .then(res => console.log('Success:', res.data))
  .catch(err => console.log('Error:', err.response?.data));
```

### Check Stored Tokens
```javascript
// In browser DevTools Console:
console.log('Access Token:', localStorage.getItem('bwin_access_token'));
console.log('Refresh Token:', localStorage.getItem('bwin_refresh_token'));
console.log('User Data:', localStorage.getItem('bwin_user')); // If stored
```

### View Auth Store State
```javascript
// In browser DevTools Console (if file is client component):
import { useAuthStore } from '@/store/authStore';
const store = useAuthStore();
console.log('Auth State:', {
  user: store.user,
  isAuthenticated: store.isAuthenticated,
  accessToken: store.accessToken
});
```

## Common Issues & Solutions

### Issue: "NEXT_PUBLIC_API_BASE_URL is empty"
**Solution:**
1. Restart dev server after changing `.env.local`
2. Clear `.next/` folder: `rm -r .next`
3. Restart: `npm run dev`

### Issue: "Cannot POST /api/v1/auth/login"
**Solution:**
1. Verify backend is running
2. Check URL in `.env.local`
3. Try accessing backend directly: `http://127.0.0.1:8000/docs`

### Issue: "401 Unauthorized"
**Solution:**
1. Clear tokens: Open DevTools Console → `localStorage.clear()`
2. Try login again
3. Check if API expects different token format

### Issue: "CORS error in browser"
**Solution:**
1. Backend CORS configuration needed
2. Add to FastAPI: `CORSMiddleware` should allow `http://localhost:3000`
3. Restart backend

### Issue: "Token not persisting after page refresh"
**Solution:**
1. Check AuthProvider is in layout
2. Verify `localStorage` has `bwin_access_token`
3. Check token is being retrieved in AuthProvider.jsx

## Performance Checks

### Network Performance
- [ ] Initial page load < 3 seconds
- [ ] API requests complete < 1 second
- [ ] No unnecessary re-renders in React DevTools

### React Query DevTools
Install React Query DevTools:
```bash
npm install @tanstack/react-query-devtools
```

Add to your layout or provider:
```javascript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Inside QueryProvider component:
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

Then:
- [ ] Open DevTools (Ctrl+Shift+J)
- [ ] See "React Query" tab
- [ ] Monitor queries and mutations
- [ ] Verify cache behavior

## Documentation Review

Review these files for reference:
- [ ] Read `QUICK_START.md` for immediate setup
- [ ] Read `API_SETUP.md` for detailed architecture
- [ ] Read `SETUP_SUMMARY.md` for component overview
- [ ] Check `src/services/authService.js` for auth endpoints
- [ ] Check `src/services/usersService.js` for user endpoints
- [ ] Check `src/hooks/useApi.js` for available hooks

## Ready for Development

Once all checks pass:
- [ ] Start building your pages using the provided hooks
- [ ] Follow patterns in example services
- [ ] Create new services for additional endpoints
- [ ] Add custom hooks for specific features
- [ ] Refer to documentation as needed

## Quick Reference

### Using Data Fetching Hooks
```javascript
import { useUsers, useCreateUser } from "@/hooks/useApi";

// In your component:
const { data, isLoading, error } = useUsers({ page: 1 });
const createMutation = useCreateUser();
```

### Making Direct API Calls
```javascript
import { authService } from "@/services/authService";

const user = await authService.getCurrentUser();
```

### Accessing Auth State
```javascript
import { useAuthStore } from "@/store/authStore";

const { user, isAuthenticated, logout } = useAuthStore();
```

### Creating New Services
1. Copy pattern from `src/services/authService.js`
2. Create `src/services/[feature]Service.js`
3. Add corresponding hooks to `src/hooks/useApi.js`
4. Use in components

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Query Docs**: https://tanstack.com/query/latest
- **Axios Docs**: https://axios-http.com
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Your API Docs**: http://127.0.0.1:8000/docs (FastAPI/Swagger)

## ✅ All Set!

If all checks pass, your admin panel is ready for:
- ✅ Authentication
- ✅ Data fetching with caching
- ✅ Mutations (create, update, delete)
- ✅ Error handling
- ✅ Token management
- ✅ State management

Start building your admin features! 🚀
