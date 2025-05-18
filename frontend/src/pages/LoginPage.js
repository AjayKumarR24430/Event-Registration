import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuthContext from '../contexts/auth/authContext';
import useRtlContext from '../contexts/rtl/rtlContext';
import Login from '../components/auth/Login';
import { FaCalendarAlt } from 'react-icons/fa';

const LoginPage = () => {
  const { isAuthenticated, user } = useAuthContext();
  const { isRtl } = useRtlContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from || '/';

  useEffect(() => {
    // If user is already authenticated, redirect based on role
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/events');
      } else {
        navigate(from);
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image with overlay text */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Event" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-900/80 flex flex-col justify-center px-12 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-12 hover:scale-105 transition-transform">
            <FaCalendarAlt className="w-6 h-6" />
            <span>EventHub</span>
          </Link>
          
          <h2 className="text-4xl font-bold text-white mb-4">Welcome to EventHub</h2>
          <p className="text-lg text-white/80 mb-8">The easiest way to discover and register for amazing events happening near you.</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Easy Registration</h3>
                <p className="text-white/70 text-sm">Register for events with just a few clicks</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Event Discovery</h3>
                <p className="text-white/70 text-sm">Find events based on your interests and location</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Secure Experience</h3>
                <p className="text-white/70 text-sm">Your data is always protected and private</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-12">
        <div className="w-full max-w-md">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;