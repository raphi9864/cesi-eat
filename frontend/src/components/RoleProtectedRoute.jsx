import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Log to check user object and required roles
  console.log('RoleProtectedRoute Check - User:', user);
  console.log('RoleProtectedRoute Check - Required Roles:', roles);

  if (!roles.includes(user.role)) {
    console.log(`RoleProtectedRoute: Role mismatch. User role "${user.role}" is not in required roles [${roles.join(', ')}]. Redirecting.`);
    return <Navigate to="/" />;
  }

  console.log('RoleProtectedRoute: Role matched. Access granted.');
  return <Outlet />;
};

export default RoleProtectedRoute;
