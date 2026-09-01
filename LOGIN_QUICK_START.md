# 🚀 Quick Action Guide - Login Testing

## Step 1: Verify Both Servers Running ✅

### Backend (FastAPI)
Check terminal showing:
```
Uvicorn running on http://127.0.0.1:8000
```

If not running:
```bash
cd bwin_apis
.venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

### Frontend (Next.js)
Check terminal showing:
```
Next.js 16.3.2 (Turbopack)
Local: http://localhost:3000
✓ Ready in 989ms
```

If not running:
```bash
cd bwin_fe_admin
npm run dev
```

## Step 2: Open Login Page 🌐

**URL:** `http://localhost:3000/login`

You should see:
- BWIN Consultants logo on left
- "Staff access" badge
- Admin | Instructor role tabs
- Email/Phone input field
- Password input field with Show/Hide button
- Remember me checkbox
- Forgot password link
- Sign in button

## Step 3: Enter Test Credentials 📝

**Role Tab:** Select **"Admin"** tab

**Email:** Copy-paste this exactly:
```
superadmin@bwin.example.com
```

**Password:** Copy-paste this exactly:
```
BwinDemo#2026
```

**Remember me:** Check or uncheck (optional)

## Step 4: Click Sign In 🔐

Button should say: **"Sign in as admin"**

Click it and wait...

### Expected Behavior:
1. Button shows: "Signing in..." (with loading)
2. Wait 1-3 seconds
3. Auto-redirect to: `http://localhost:3000/dashboard`
4. Dashboard loads with:
   - Sidebar on left
   - Header on top
   - Main content area
   - Welcome message with your name

## Step 5: Verify Success ✅

**Check 1: User Info**
- Look for your name/email in header or profile area
- Should show: Logged-in user name

**Check 2: Browser Storage (DevTools)**
```
Press F12 (or Ctrl+Shift+J on Windows)
Go to: Application > Local Storage > localhost:3000

Look for:
- bwin_access_token = (long JWT string)
- bwin_refresh_token = (long JWT string)
```

**Check 3: Network Request (DevTools)**
```
Press F12
Go to: Network tab
Filter: XHR or Fetch
Login again and watch for:
- POST request to /api/v1/auth/login
- Response: 200 status with tokens
- Headers include: Authorization: Bearer...
```

**Check 4: Page Refresh (Persistence)**
```
Press F5 to refresh page
Should:
- Stay on dashboard
- NOT redirect to login
- Show same user info
- No flickering redirect
```

## 🎯 Success Indicators

### ✅ Login Successful If:
- [ ] Redirected to dashboard
- [ ] Dashboard loads without redirect loop
- [ ] User name appears in greeting/header
- [ ] Tokens visible in localStorage
- [ ] Page refresh keeps you logged in
- [ ] Network shows successful /auth/login request

### ❌ Login Failed If:
- [ ] Error message appears on login form
- [ ] Stays on login page after clicking sign in
- [ ] Redirects to login after sign in
- [ ] No tokens in localStorage
- [ ] DevTools console shows errors

## 🔍 Troubleshooting Checklist

**If Login Doesn't Work:**

### 1. Check Backend
```bash
curl http://127.0.0.1:8000/docs
```
Should open FastAPI Swagger UI

If not: Backend not running

### 2. Check Frontend
```
Visit: http://localhost:3000/login
```
Should load login form

If not: Frontend not running or error in build

### 3. Check Credentials
```
Email: superadmin@bwin.example.com
Password: BwinDemo#2026
```
Copy-paste exactly (no spaces)

If error: Check backend logs for validation error

### 4. Check CORS
If error mentions "CORS":
1. Backend CORS may not allow localhost:3000
2. Add to backend CORS settings
3. Restart backend

### 5. Check API URL
In file: `.env.local`
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

If wrong: Update and restart frontend

## 📋 DevTools Debugging

### View Login Request
```
1. Press F12
2. Go to Network tab
3. Clear network (trash icon)
4. Enter credentials and click login
5. Look for: POST /api/v1/auth/login
6. Click it
7. View:
   - Request tab: See { role, identifier, password, remember }
   - Response tab: See { access_token, refresh_token, user }
   - Headers tab: See Authorization header added
```

### View Auth Store State
```
In console, type:
import { useAuthStore } from '@/store/authStore';
useAuthStore.getState()

Should show:
{
  user: { ... },
  accessToken: "eyJ...",
  isAuthenticated: true,
  ...
}
```

### View Token Content
```
In console, type:
const token = localStorage.getItem('bwin_access_token');
JSON.parse(atob(token.split('.')[1]))

Should show user info stored in JWT
```

## 🔄 Test Token Refresh

Backend will test this automatically, but to verify:

1. Login successfully
2. Wait for token to expire (if configured)
3. Make any API request (click a menu item, etc.)
4. API client will:
   - Detect 401 response
   - Auto-call /auth/refresh
   - Get new token
   - Retry original request
5. User sees no interruption
6. New token in localStorage

## 🚫 Common Errors & Fixes

### Error: "Cannot POST /auth/login"
**Cause:** Backend not running or wrong endpoint
**Fix:** Start backend, verify URL in .env.local

### Error: "Invalid credentials"
**Cause:** Wrong email/password
**Fix:** Double-check: superadmin@bwin.example.com / BwinDemo#2026

### Error: "CORS error"
**Cause:** Backend doesn't allow localhost:3000
**Fix:** Update backend CORS config to allow frontend URL

### Error: "Token not persisting"
**Cause:** Token not storing in localStorage
**Fix:** Check DevTools → Application → Local Storage

### Error: "Redirect loop"
**Cause:** Auth check not working properly
**Fix:** 
1. Clear localStorage: localStorage.clear()
2. Clear .next folder: rm -r .next
3. Restart npm run dev

## ⏱️ Expected Performance

| Action | Time |
|--------|------|
| Page load | < 1s |
| Form validation | Instant |
| Login request | 1-2s |
| Redirect to dashboard | < 0.5s |
| Dashboard render | 1-2s |

## 📞 Support

If issues arise, check:
1. `LOGIN_IMPLEMENTATION_SUMMARY.md` - Detailed info
2. `LOGIN_TESTING_GUIDE.md` - Testing procedures
3. `API_SETUP.md` - API configuration
4. Backend logs for error details
5. Browser console (F12) for JavaScript errors

## ✨ Success Path

```
Backend Running? ✓
Frontend Running? ✓
   ↓
Open http://localhost:3000/login ✓
   ↓
See login form? ✓
   ↓
Enter credentials ✓
   ↓
Click "Sign in as admin" ✓
   ↓
Redirected to dashboard? ✓
   ↓
User name displays? ✓
   ↓
Tokens in localStorage? ✓
   ↓
Page refresh = stays logged in? ✓
   ↓
🎉 LOGIN SUCCESS! 🎉
```

---

**Ready?** Click the link: `http://localhost:3000/login`

Let me know if you encounter any issues!
