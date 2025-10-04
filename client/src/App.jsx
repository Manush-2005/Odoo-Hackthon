import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ApprovalRules from './pages/admin/ApprovalRules';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ExpenseSubmission from './pages/employee/ExpenseSubmission';
import ExpenseHistory from './pages/employee/ExpenseHistory';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ApprovalManagement from './pages/manager/ApprovalManagement';
import PendingApprovals from './pages/manager/PendingApprovals';
import Profile from './pages/common/Profile';

// MUI Theme
const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-all duration-300">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  {/* Admin Routes */}
                  <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
                  <Route path="admin/approval-rules" element={<ProtectedRoute roles={['admin']}><ApprovalRules /></ProtectedRoute>} />
                  
                  {/* Employee Routes */}
                  <Route path="employee" element={<ProtectedRoute roles={['employee', 'manager', 'admin']}><EmployeeDashboard /></ProtectedRoute>} />
                  <Route path="employee/submit" element={<ProtectedRoute roles={['employee', 'manager', 'admin']}><ExpenseSubmission /></ProtectedRoute>} />
                  <Route path="employee/history" element={<ProtectedRoute roles={['employee', 'manager', 'admin']}><ExpenseHistory /></ProtectedRoute>} />
                  
                  {/* Manager Routes */}
                  <Route path="manager" element={<ProtectedRoute roles={['manager', 'admin']}><ManagerDashboard /></ProtectedRoute>} />
                  <Route path="manager/approvals" element={<ProtectedRoute roles={['manager', 'admin']}><ApprovalManagement /></ProtectedRoute>} />
                  <Route path="manager/pending" element={<ProtectedRoute roles={['manager', 'admin']}><PendingApprovals /></ProtectedRoute>} />
                  
                  {/* Common Routes */}
                  <Route path="profile" element={<Profile />} />
                  
                  {/* Default redirect based on role */}
                  <Route path="" element={<Navigate to="employee" replace />} />
                </Route>
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
          
          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="mt-16"
          />
        </AuthProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;