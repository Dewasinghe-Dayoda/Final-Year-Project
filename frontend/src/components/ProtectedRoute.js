//Prevent users from accessing UserProfile.js without logging in.
// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
