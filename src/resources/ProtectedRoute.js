import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, ...rest }) => {
  const auth = useSelector((state) => state.auth);

  // Safely extract authentication status and user role
  const isAuthenticated = auth.isAuthenticated;
  const userRole = auth.user?.role; // Optional chaining to handle null or undefined user

  // Check authentication and role
  if (isAuthenticated && userRole === "admin") {
    return element;
  }

  // Redirect to home if not authenticated or not an admin
  return <Navigate to="/" />;
};

export default ProtectedRoute;
