import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, allowedRoles, publicRoute = false }) => {
  const auth = useSelector((state) => state.auth);

  // Safely extract authentication status and user role
  const isAuthenticated = auth.isAuthenticated;
  const userRole = auth.user?.role; // Optional chaining to handle null or undefined user

  // Handle public routes (e.g., login, register)
  if (publicRoute && isAuthenticated) {
    // Redirect authenticated users away from login/register pages
    return <Navigate to="/" />;
  }

  // Check if user is authenticated for protected routes
  if (!isAuthenticated && !publicRoute) {
    return <Navigate to="/login" />;
  }

  // Check if the user has the required role for protected routes
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Render the element if all conditions are satisfied
  return element;
};

export default ProtectedRoute;
