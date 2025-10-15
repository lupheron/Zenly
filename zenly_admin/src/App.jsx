import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Layouts/Authentication/Login";
import Register from "./Layouts/Authentication/Register";
import AdminLayout from "./Layouts/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/users/Users";
import DetailedUser from "./Pages/users/[id]/DetailedUser";
import useLoginStore from "./hooks/Auth/useLogin";
import DetailedPosts from './Components/Macro/Posts/[id]/DetailedPosts';
import PostEditForm from './Components/Macro/Forms/Post/PostEditForm';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, loading } = useLoginStore();
  const [isChecking, setIsChecking] = React.useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      await checkAuth();
      setIsChecking(false);
    };
    
    verifyAuth();
  }, [checkAuth]);

  // Show loading while checking authentication
  if (isChecking || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Quicksand, sans-serif',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f0f0f0',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{ fontSize: '1.2rem', color: '#6c757d' }}>
          Verifying authentication...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <DetailedUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <DetailedPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <PostEditForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
