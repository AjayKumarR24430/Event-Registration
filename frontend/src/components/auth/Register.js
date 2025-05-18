import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const Register = () => {
  const { register, error, clearErrors, isAuthenticated } = useAuthContext();
  const { t } = useRtlContext();
  
  const navigate = useNavigate();

  useEffect(() => {
    // Create a flag to track if component is mounted
    let isMounted = true;
    
    // Only redirect if component is still mounted
    if (isAuthenticated && isMounted) {
      navigate('/');
    }
    
    // Cleanup function to run when component unmounts
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
    if (e.target.name === 'confirmPassword' && password !== e.target.value) {
      setPasswordError(t('Passwords do not match'));
    } else if (e.target.name === 'confirmPassword' && password === e.target.value) {
      setPasswordError('');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError(t('Passwords do not match'));
    } else {
      register({
        username,
        email,
        password
      });
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md card backdrop-blur-sm shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {t('Create Account')}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {t('Join our community and discover amazing events')}
        </p>
        
        {error && (
          <div className="alert alert-danger mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="form-group mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="username">
              {t('Username')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaUser className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                required
                className="form-control pl-12"
                placeholder={t('Enter your preferred username')}
              />
            </div>
          </div>
          
          <div className="form-group mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="email">
              {t('Email Address')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="form-control pl-12"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div className="form-group mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="password">
              {t('Password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
                className="form-control pl-12"
                placeholder={t('Minimum 6 characters')}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('Password must be at least 6 characters')}</p>
          </div>
          
          <div className="form-group mb-5">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="confirmPassword">
              {t('Confirm Password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaLock className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
                minLength="6"
                className="form-control pl-12"
                placeholder={t('Re-enter your password')}
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          
          <div className="mt-8">
            <button 
              type="submit" 
              className="btn btn-primary w-full py-3 flex items-center justify-center gap-3 group"
            >
              <span>{t('Create Account')}</span>
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
            {t('Already have an account?')} <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">{t('Sign In')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;