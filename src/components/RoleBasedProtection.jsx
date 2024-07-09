import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export const RoleBasedProtection = ({ children }) => {
  const { user } = useAuth();

  if (user && user.resp.data.user.user_role != 1) {
    // user is not authenticated
    return <Navigate to="/profile" />;
  }
  return children;
};