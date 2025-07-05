import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import LoginAdmin from './pages/LoginAdmin';
import LoginStudent from './pages/LoginStudent';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentLog from './pages/StudentLog';
import LogHistory from './pages/LogHistory';
import StudentProfile from './pages/StudentProfile';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/layout/Layout';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('admin' | 'student')[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login/admin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin Routes Component
const AdminRoutes: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/student-log" element={<StudentLog />} />
          <Route path="/log-history" element={<LogHistory />} />
          <Route path="/student/:id" element={<StudentProfile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
};

// Student Routes Component
const StudentRoutes: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/student-log" element={<StudentLog />} />
          <Route path="/log-history" element={<LogHistory />} />
          <Route path="/student/:id" element={<StudentProfile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </ProtectedRoute>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Protected Student Routes */}
        <Route path="/student/*" element={<StudentRoutes />} />

        {/* Redirect based on user role */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            ) : (
              <Navigate to="/login/admin" replace />
            )
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Root App Component with AuthProvider and ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;