import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Layouts/Authentication/Login";
import Register from "./Layouts/Authentication/Register";
import Dashboard from "./Pages/Dashboard";
import DetailedUser from "./Pages/users/[id]/DetailedUser";
import useLoginStore from "./hooks/Auth/useLogin";
import DetailedPosts from './Components/Macro/Posts/[id]/DetailedPosts';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth } = useLoginStore();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
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
          path="/users/:id"
          element={
            <ProtectedRoute>
              <DetailedUser />
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
