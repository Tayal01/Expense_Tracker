import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/register" replace />;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Unknown URLs fall back to the app root (which itself redirects
          logged-out visitors to /register). */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
