import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';

const AdminRoute = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  
  return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;