# Zenly Admin - Setup Instructions

## Fix for "Cancelled" Error on Login

The "cancelled" error was caused by missing environment configuration. Follow these steps to fix it:

### 1. Create Environment File

Create a file named `.env` in the `zenly_admin` folder (root of the admin project) with the following content:

```env
REACT_APP_API_URL=https://api.zenly.uz/api
```

**Important**: The `.env` file should be in the same directory as `package.json`.

### 2. Restart the Development Server

After creating the `.env` file, restart your React development server:

```bash
# Stop the current server (Ctrl+C)
# Then start it again
npm start
```

### 3. Clear Browser Cache (Optional but Recommended)

Clear your browser's localStorage and cache:
- Open browser DevTools (F12)
- Go to Application tab (Chrome) or Storage tab (Firefox)
- Click "Clear site data" or manually delete items in Local Storage
- Refresh the page

---

## What Was Fixed

### Admin Panel (Frontend)

**File: `zenly_admin/src/hooks/axios.js`**

1. **Changed default API URL** from `http://localhost:8000/api` to `https://api.zenly.uz/api`
2. **Increased timeout** from 10 seconds to 15 seconds
3. **Fixed auth headers** - Now doesn't send Authorization headers to login/register endpoints
4. **Fixed redirect loop** - Login page no longer redirects back to itself on 401 errors
5. **Added Content-Type header** - Ensures proper JSON requests

### Backend (Laravel)

**File: `ZenlyServer/app/Http/Middleware/Cors.php`**

1. **Added X-Admin-ID header** to allowed CORS headers
   - This header is sent by the admin panel for admin authentication
   - Without this, browser would block the requests

---

## Environment Variables

The admin panel reads the API URL from environment variables in this order:

1. `process.env.REACT_APP_API_URL` - from .env file (highest priority)
2. Fallback: `https://api.zenly.uz/api` (hardcoded as backup)

### Creating the .env file

**Option 1: Using Command Line**

```bash
# Navigate to zenly_admin folder
cd zenly_admin

# Create .env file (Windows)
echo REACT_APP_API_URL=https://api.zenly.uz/api > .env

# OR Create .env file (Mac/Linux)
echo "REACT_APP_API_URL=https://api.zenly.uz/api" > .env
```

**Option 2: Manual Creation**

1. Open `zenly_admin` folder
2. Create a new file named `.env` (no extension, starts with dot)
3. Add this line: `REACT_APP_API_URL=https://api.zenly.uz/api`
4. Save the file

---

## Backend Environment (Optional)

If you need to configure CORS for production, update your Laravel `.env` file:

```env
# In ZenlyServer/.env
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
APP_ENV=production
```

---

## Troubleshooting

### Still seeing "cancelled" error?

1. **Verify .env file exists**
   ```bash
   ls -la zenly_admin/.env
   # OR on Windows
   dir zenly_admin\.env
   ```

2. **Check the file content**
   - Make sure there are no extra spaces
   - Make sure the URL is exactly: `https://api.zenly.uz/api`

3. **Restart the server**
   ```bash
   npm start
   ```

4. **Clear browser cache and localStorage**

5. **Check browser console**
   - Open DevTools (F12)
   - Go to Network tab
   - Try to login
   - Check if the request URL is correct

### Login request goes to wrong URL?

- Make sure you restarted the development server after creating .env
- React only reads .env files when the server starts

### CORS errors?

- Make sure the backend has been updated with the CORS fix
- Check that your admin domain is in CORS_ALLOWED_ORIGINS on the backend

---

## Summary

The main issue was that the admin panel was trying to connect to `http://localhost:8000/api` instead of `https://api.zenly.uz/api`, causing the requests to be cancelled.

**The fix:**
1. ✅ Created .env file with correct API URL
2. ✅ Fixed axios interceptors to prevent redirect loops
3. ✅ Updated CORS headers on backend
4. ✅ Improved error handling

After following these steps, the login should work without any "cancelled" errors.

