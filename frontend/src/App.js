import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

const AppContent = () => {
  const { loadUser, user, loading } = useAuthContext();
  const { isRtl } = useRtlContext();

  useEffect(() => {
    // Only load user if we haven't already and there's a token
    if (localStorage.token) {
      loadUser();
    }
  }, []);


  const appClass = isRtl ? 'rtl' : 'ltr';

  return (
    <Router>
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
                  <AdminRegistrationsPage />
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthState>
      <EventState>
        <RegistrationState>
          <RtlState>
            <AppContent />
          </RtlState>
        </RegistrationState>
      </EventState>
    </AuthState>
  );
};

export default App;