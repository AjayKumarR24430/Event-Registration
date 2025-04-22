import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/auth/authContext';
import useRtlContext from '../contexts/rtl/rtlContext';
import Register from '../components/auth/Register';

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className={`text-3xl font-bold mb-8 text-center ${isRtl ? 'text-right' : 'text-left'}`}>
          {isRtl ? 'إنشاء حساب جديد' : 'Create an Account'}
        </h1>
        
        <div className="bg-white shadow-md rounded-lg p-8">
          <Register />
          
          <div className={`mt-4 text-center ${isRtl ? 'text-right' : 'text-left'}`}>
            <p>
              {isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                {isRtl ? 'تسجيل الدخول' : 'Login'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;