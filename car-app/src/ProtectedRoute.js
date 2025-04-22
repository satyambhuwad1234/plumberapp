import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Check if the user is logged in

  // If not logged in, redirect to login page, else render the nested routes (Outlet)
  return isLoggedIn ? <Outlet /> : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;
