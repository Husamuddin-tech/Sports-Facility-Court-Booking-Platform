import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useMemo } from 'react';
import { useAuth } from './context/AuthContext.js';
import AuthProvider from './context/AuthProvider.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

// Lazy-loaded pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

/* --------------------------
   Small themed spinner
   -------------------------- */
const Spinner = ({ size = 12, label = 'Loading' }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      role="status"
      aria-live="polite"
      className={`w-${size} h-${size} rounded-full border-4 border-mutedCharcoal border-t-graphite animate-spin`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
    <span className="text-sm text-mutedCharcoal/90">{label}…</span>
  </div>
);

/* --------------------------
   Simple Error Boundary
   -------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, error: err };
  }
  componentDidCatch() {
    // Optionally log error to an external service
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <h2 className="text-2xl font-semibold text-graphite mb-2">Something went wrong</h2>
            <p className="text-mutedCharcoal mb-4">
              An unexpected error occurred while loading this part of the app.
            </p>
            <button
              className="inline-block px-4 py-2 rounded-md border border-mutedCharcoal bg-frostWhite text-graphite hover:shadow-sm"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* --------------------------
   Protected Route Component
   - tolerant to missing `loading` from context
   -------------------------- */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const auth = useAuth();
  // If consumer doesn't expose loading, treat as false (already resolved)
  const loading = typeof auth?.loading !== 'undefined' ? auth.loading : false;
  const isAuthenticated = !!auth?.isAuthenticated;
  const isAdmin = !!auth?.isAdmin;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-frostWhite">
        <Spinner size={56} label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
};

/* --------------------------
   App content — themed layout
   -------------------------- */
function AppContent() {
  // memo toaster theme to avoid re-creating object each render
  const toastOptions = useMemo(
    () => ({
      duration: 4000,
      style: {
        background: '#F5F7FA', // frostWhite
        color: '#1F2937', // graphite
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
      },
      success: {
        iconTheme: { primary: '#E5E7EB', secondary: '#ffffff' }, // paleSteel
      },
      error: {
        iconTheme: { primary: '#374151', secondary: '#ffffff' }, // mutedCharcoal
      },
    }),
    []
  );

  return (
    <div className="flex flex-col min-h-screen bg-softSand text-graphite antialiased">
      <Navbar />
      <main className="grow">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size={48} label="Loading page" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />

      <Toaster position="top-right" toastOptions={toastOptions} />
    </div>
  );
}

/* --------------------------
   App root
   -------------------------- */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
