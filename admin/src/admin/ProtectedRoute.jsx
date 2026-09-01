import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import AdminLoader from './components/AdminLoader';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AdminLoader fullscreen message="Verifying session…" subtext="Authenticating administrator credentials" />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}