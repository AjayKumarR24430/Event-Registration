import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/layout/PrivateRoute';
import AdminRoute from './components/layout/AdminRoute';

// Page Components
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import AdminRegistrationsPage from './pages/AdminRegistrationsPage';
import AdminEventsPage from './pages/AdminEventsPage';
import EventRegistrationsDashboard from './components/admin/EventRegistrationsDashboard';
import AdminEventDetails from './components/admin/AdminEventDetails';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import FAQPage from './components/pages/FAQPage';
import LegalPage from './components/pages/LegalPage';

// Context Providers
import AuthState from './contexts/auth/AuthState';
import EventState from './contexts/event/EventState';
import RegistrationState from './contexts/registration/RegistrationState';
import RtlState from './contexts/rtl/RtlState';
import useAuthContext from './contexts/auth/authContext';
import useRtlContext from './contexts/rtl/rtlContext';

import setAuthToken from './utils/setAuthToken';

// Check for token in storage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const AppRoutes = () => {
  const { loadUser, user, loading, isAuthenticated } = useAuthContext();
  const { isRtl } = useRtlContext();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (localStorage.token && !user) {
        await loadUser();
      }
    };
    initializeAuth();
  }, [loadUser, user]);

  // Handle authentication state changes
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Clear any sensitive data from state
      localStorage.removeItem('token');
      // Only redirect from protected routes
      const path = window.location.pathname;
      if (path.includes('/admin') || path.includes('/my-registrations')) {
        navigate('/');
      }
    }
  }, [isAuthenticated, loading, navigate]);

  const appClass = isRtl ? 'rtl' : 'ltr';

  return (
    <div className={`min-h-screen flex flex-col ${appClass}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/my-registrations" 
            element={
              <PrivateRoute>
                <MyRegistrationsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/registrations" 
            element={
              <AdminRoute>
                <EventRegistrationsDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <AdminRoute>
                <AdminEventsPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events/:eventId" 
            element={
              <AdminRoute>
                <AdminEventDetails />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/events/:eventId/registrations" 
            element={
              <AdminRoute>
                <EventRegistrationsDashboard />
              </AdminRoute>
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthState>
      <EventState>
        <RegistrationState>
          <RtlState>
            <Router>
              <AppRoutes />
            </Router>
          </RtlState>
        </RegistrationState>
      </EventState>
    </AuthState>
  );
};

export default App;