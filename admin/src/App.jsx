import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './admin/AuthContext';
import ToastProvider from './admin/components/Toast';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Sections from './pages/admin/Sections';
import SectionEditor from './pages/admin/SectionEditor';
import Settings from './pages/admin/Settings';
import ApiKeys from './pages/admin/ApiKeys';
import Media from './pages/admin/Media';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="sections" element={<Sections />} />
            <Route path="sections/new" element={<SectionEditor />} />
            <Route path="sections/:sectionId" element={<SectionEditor />} />
            <Route path="media" element={<Media />} />
            <Route path="apikeys" element={<ApiKeys />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;