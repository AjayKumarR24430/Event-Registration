import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const { register, error, clearErrors, isAuthenticated } = useAuthContext();
  const { t } = useRtlContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const containerRef = useRef(null);
  
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

  // Mouse move effect for spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        container.style.setProperty('--x', `${x}%`);
        container.style.setProperty('--y', `${y}%`);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    setIsSubmitting(true);
    
    if (password !== confirmPassword) {
      setPasswordError(t('Passwords do not match'));
      setIsSubmitting(false);
    } else {
      register({
        username,
        email,
        password
      }).catch(() => {
        setIsSubmitting(false);
      });
    }
  };

  const onFocus = (field) => {
    setFocusedField(field);
  };

  const onBlur = () => {
    setFocusedField(null);
  };

  return (
    <div 
      ref={containerRef}
      className="relative z-10 spotlight"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-fadeIn">
          {t('Create Account')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('Join our community and discover amazing events')}
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 flex items-start animate-slideIn">
          <div className="mr-3 text-red-500 dark:text-red-400 flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="form-group">
          <label 
            className={`block text-sm font-medium mb-2 transition-all duration-200 ${
              focusedField === 'username' 
                ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            htmlFor="username"
          >
            {t('Username')}
          </label>
          <div className={`relative transition-all duration-300 ${
            focusedField === 'username' 
              ? 'transform scale-[1.02]' 
              : ''
          }`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaUser className={`w-5 h-5 transition-colors duration-200 ${
                focusedField === 'username' 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-600'
              }`} />
            </div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              onFocus={() => onFocus('username')}
              onBlur={onBlur}
              required
              disabled={isSubmitting}
              className={`form-control-glass pl-12 transition-all duration-300 border-gray-300 dark:border-gray-700 ${
                focusedField === 'username' 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' 
                  : 'hover:border-gray-400 dark:hover:border-gray-600'
              }`}
              placeholder={t('Enter your preferred username')}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label 
            className={`block text-sm font-medium mb-2 transition-all duration-200 ${
              focusedField === 'email' 
                ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            htmlFor="email"
          >
            {t('Email Address')}
          </label>
          <div className={`relative transition-all duration-300 ${
            focusedField === 'email' 
              ? 'transform scale-[1.02]' 
              : ''
          }`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaEnvelope className={`w-5 h-5 transition-colors duration-200 ${
                focusedField === 'email' 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-600'
              }`} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              onFocus={() => onFocus('email')}
              onBlur={onBlur}
              required
              disabled={isSubmitting}
              className={`form-control-glass pl-12 transition-all duration-300 border-gray-300 dark:border-gray-700 ${
                focusedField === 'email' 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' 
                  : 'hover:border-gray-400 dark:hover:border-gray-600'
              }`}
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label 
            className={`block text-sm font-medium mb-2 transition-all duration-200 ${
              focusedField === 'password' 
                ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            htmlFor="password"
          >
            {t('Password')}
          </label>
          <div className={`relative transition-all duration-300 ${
            focusedField === 'password' 
              ? 'transform scale-[1.02]' 
              : ''
          }`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className={`w-5 h-5 transition-colors duration-200 ${
                focusedField === 'password' 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-600'
              }`} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              onFocus={() => onFocus('password')}
              onBlur={onBlur}
              required
              minLength="6"
              disabled={isSubmitting}
              className={`form-control-glass pl-12 pr-10 transition-all duration-300 border-gray-300 dark:border-gray-700 ${
                focusedField === 'password' 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' 
                  : 'hover:border-gray-400 dark:hover:border-gray-600'
              }`}
              placeholder={t('Minimum 6 characters')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-1">{t('Password must be at least 6 characters')}</p>
        </div>
        
        <div className="form-group">
          <label 
            className={`block text-sm font-medium mb-2 transition-all duration-200 ${
              focusedField === 'confirmPassword' 
                ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            htmlFor="confirmPassword"
          >
            {t('Confirm Password')}
          </label>
          <div className={`relative transition-all duration-300 ${
            focusedField === 'confirmPassword' 
              ? 'transform scale-[1.02]' 
              : ''
          }`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className={`w-5 h-5 transition-colors duration-200 ${
                focusedField === 'confirmPassword' 
                ? 'text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-400 dark:text-gray-600'
              }`} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              onFocus={() => onFocus('confirmPassword')}
              onBlur={onBlur}
              required
              minLength="6"
              disabled={isSubmitting}
              className={`form-control-glass pl-12 pr-10 transition-all duration-300 border-gray-300 dark:border-gray-700 ${
                focusedField === 'confirmPassword' 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' 
                  : 'hover:border-gray-400 dark:hover:border-gray-600'
              } ${passwordError ? 'border-red-500 dark:border-red-500' : ''}`}
              placeholder={t('Re-enter your password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-xs mt-1 ml-1 animate-pulse">{passwordError}</p>
          )}
        </div>
        
        <div className="mt-8">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`group relative w-full btn btn-primary py-3 flex items-center justify-center gap-3 ${
              isSubmitting ? 'opacity-70 cursor-wait' : 'hover:shadow-lg hover-lift'
            }`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className={`h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-transform duration-300 ${isSubmitting ? 'animate-spin' : 'group-hover:translate-x-1'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span>{isSubmitting ? t('Creating Account...') : t('Create Account')}</span>
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('Already have an account?')}{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors hover:underline">
              {t('Sign In')}
            </Link>
          </p>
          
          <p className="text-xs text-gray-500 mt-4">
            {t('By registering, you agree to our')}{' '}
            <Link to="/legal" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {t('Terms of Service')}
            </Link>{' '}
            {t('and')}{' '}
            <Link to="/legal" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              {t('Privacy Policy')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;