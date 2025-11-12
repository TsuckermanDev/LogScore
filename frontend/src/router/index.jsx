import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import LogsPage from '../pages/LogsPage.jsx';
import StatsPage from '../pages/StatsPage';
import ArchitecturePage from '../pages/ArchitecturePage';
import SettingsPage from '../pages/SettingsPage.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/logs" replace />;
    }

    return children;
};

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/login',
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        )
    },
    {
        path: '/logs',
        element: (
            <ProtectedRoute>
                <LogsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/stats',
        element: (
            <ProtectedRoute>
                <StatsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '/architecture',
        element: (
            <ProtectedRoute>
                <ArchitecturePage />
            </ProtectedRoute>
        )
    },
    {
        path: '/settings',
        element: (
            <ProtectedRoute>
                <SettingsPage />
            </ProtectedRoute>
        )
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
]);
