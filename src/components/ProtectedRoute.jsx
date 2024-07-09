import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  

  if (!user) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }
  return children;
};