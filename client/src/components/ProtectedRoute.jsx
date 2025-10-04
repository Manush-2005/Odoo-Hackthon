import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!user) {
    // Redirect to signin with the return url
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    // User doesn't have required role, redirect to their default dashboard
    const defaultRoute = user.role === 'admin' ? '/admin' : 
                         user.role === 'manager' ? '/manager' : '/employee';
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;