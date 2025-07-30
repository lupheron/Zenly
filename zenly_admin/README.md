# Zenly Admin Panel

A React-based admin panel with a fully working authentication system.

## Features

- ✅ Complete login/logout functionality
- ✅ Protected routes with authentication
- ✅ Admin dashboard with user information
- ✅ Form validation and error handling
- ✅ Remember me functionality
- ✅ Responsive design
- ✅ State management with Zustand

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Start the Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints Used

The admin panel connects to the following Laravel API endpoints:

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout  
- `GET /api/admin/me` - Get current admin profile
- `PUT /api/admin/{id}` - Update admin profile
- `DELETE /api/admin/{id}` - Delete admin account

## Authentication Flow

1. **Login**: Users enter username and password
2. **Token Storage**: JWT token is stored in localStorage
3. **Route Protection**: Protected routes check authentication status
4. **Auto-redirect**: Authenticated users are redirected to dashboard
5. **Logout**: Clears token and redirects to login

## File Structure

```
src/
├── Components/
│   ├── Macro/Forms/Login/LoginForm.jsx
│   └── Mircro/
│       ├── Button/ButtonDefault.jsx
│       └── FormElements/Input/InputDefault.jsx
├── hooks/
│   ├── Auth/useLogin.js
│   └── axios.js
├── Layouts/Authentication/Login.jsx
├── Pages/Dashboard.jsx
└── App.jsx
```

## Usage

1. Navigate to `/login` to access the login form
2. Enter admin credentials
3. Upon successful login, you'll be redirected to `/dashboard`
4. Use the logout button to sign out

## Security Features

- Admin isolation (admins can only access their own data)
- Token-based authentication
- Automatic token refresh
- Protected routes
- Form validation
- Error handling

## Development

The application uses:
- **React 19** for the UI
- **Zustand** for state management
- **Axios** for API calls
- **React Router** for navigation
- **CSS Modules** for styling
