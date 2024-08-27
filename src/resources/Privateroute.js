import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Adjust based on your state management

const PrivateRoute = ({ element, ...rest }) => {
  const auth = useSelector((state) => state.auth);
    // console.log(element.type.name)
  return auth.isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
