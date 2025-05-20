// src/Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pages from './pages/pages';
import Components from './pages/Components';
import Settings from './pages/Settings';
import NotFound from './pages/Notfound';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Emissions from './pages/Emissions';

// Protected route component that requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages"
        element={
          <ProtectedRoute>
            <Pages />
          </ProtectedRoute>
        }
      />
      {/* New Home route */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      {/* Emissions Dashboard route */}
      <Route
        path="/emissions"
        element={
          <ProtectedRoute>
            <Emissions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/components"
        element={
          <ProtectedRoute>
            <Components />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Not found route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;