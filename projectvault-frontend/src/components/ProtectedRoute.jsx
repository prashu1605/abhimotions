import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roleRequired, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in → always go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
