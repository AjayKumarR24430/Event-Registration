import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthContext from '../contexts/auth/authContext';
import useRtlContext from '../contexts/rtl/rtlContext';
import Register from '../components/auth/Register';
import { FaCalendarAlt } from 'react-icons/fa';

const RegisterPage = () => {
  const { isAuthenticated } = useAuthContext();
  const { isRtl } = useRtlContext();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse">
      {/* Right side - Image with overlay text */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Event" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/80 flex flex-col justify-center px-12 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-12 hover:scale-105 transition-transform">
            <FaCalendarAlt className="w-6 h-6" />
            <span>EventHub</span>
          </Link>
          
          <h2 className="text-4xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-lg text-white/80 mb-8">Create an account and start discovering amazing events tailored to your interests.</p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Personalized Recommendations</h3>
                <p className="text-white/70 text-sm">Discover events that match your preferences</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Track Your Registrations</h3>
                <p className="text-white/70 text-sm">Keep all your event tickets in one place</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-white/20 rounded-full p-2 backdrop-blur-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Free Account</h3>
                <p className="text-white/70 text-sm">No fees to create an account and browse events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Left side - Register form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 md:p-12">
        <div className="w-full max-w-md">
          <Register />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;