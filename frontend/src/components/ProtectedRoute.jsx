import { Navigate } from "react-router-dom";
import { useAuthStore } from "../contexts/AuthStore";

export default function ProtectedRoute({ children,role }) {
  const { authUser, authRole,isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return <div className="text-center mt-10">Checking session...</div>;
  }  
  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  if (role && authRole !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
