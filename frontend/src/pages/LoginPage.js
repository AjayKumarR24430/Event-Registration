import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/auth/authContext';
import useRtlContext from '../contexts/rtl/rtlContext';
import Login from '../components/auth/Login';

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className={`text-3xl font-bold mb-8 text-center ${isRtl ? 'text-right' : 'text-left'}`}>
          {isRtl ? 'تسجيل الدخول' : 'Login'}
        </h1>
        
        <div className="bg-white shadow-md rounded-lg p-8">
          <Login />
          
          <div className={`mt-4 text-center ${isRtl ? 'text-right' : 'text-left'}`}>
            <p>
              {isRtl ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
              <a href="/register" className="text-blue-600 hover:underline">
                {isRtl ? 'سجل الآن' : 'Register Now'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;