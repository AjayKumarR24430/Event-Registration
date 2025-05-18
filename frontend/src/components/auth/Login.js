import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { 
  FaEnvelope, FaLock, FaGoogle, FaFacebook, FaEye, 
  FaEyeSlash, FaArrowRight, FaCalendarAlt
} from 'react-icons/fa';

const Login = () => {
  const { login, error, clearErrors, isAuthenticated, user } = useAuthContext();
  const { t, isRtl } = useRtlContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const containerRef = useRef(null);
  
  // Fixed text with proper capitalization
  const loginText = {
    welcome: "Welcome Back",
    loginPrompt: "Sign in to your account to continue",
    email: "Email Address",
    password: "Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    login: "Sign In",
    loggingIn: "Signing In...",
    orContinueWith: "Or continue with",
    noAccount: "Don't have an account?",
    register: "Create Account",
    errorMessage: "Invalid email or password"
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role after successful authentication
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/events');
      } else {
        navigate('/');
      }
    }
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

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
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearErrors();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login({ email, password });
      if (!success) {
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
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
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-fadeIn">
          {isRtl ? t('welcome') : loginText.welcome}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isRtl ? t('loginPrompt') : loginText.loginPrompt}
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
              {isRtl ? error : loginText.errorMessage}
            </p>
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="form-group">
          <label 
            className={`block mb-2 text-sm font-medium transition-all duration-200 ${
              focusedField === 'email' 
                ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            htmlFor="email"
          >
            {isRtl ? t('email') : loginText.email}
          </label>
          <div className={`relative transition-all duration-300 ${
            focusedField === 'email' 
              ? 'transform scale-[1.02]' 
              : ''
          }`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className={`h-5 w-5 transition-colors duration-200 ${
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
              className={`form-control-glass pl-10 transition-all duration-300 border-gray-300 dark:border-gray-700 ${
                focusedField === 'email' 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' 
                  : 'hover:border-gray-400 dark:hover:border-gray-600'
              }`}
              placeholder="email@example.com"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label 
            className={`block mb-2 text-sm font-medium transition-all duration-200 ${
              focusedField === 'password' 
                ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' 
                : 'text-gray-700 dark:text-gray-300'
            }`} 
            htmlFor="password"
          >
            {isRtl ? t('password') : loginText.password}
          </label>
          <div className={`relative transition-all duration-300 ${
            focusedField === 'password' 
              ? 'transform scale-[1.02]' 
              : ''
          }`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className={`h-5 w-5 transition-colors duration-200 ${
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
              disabled={isSubmitting}
              className={`form-control-glass pl-10 pr-10 transition-all duration-300 border-gray-300 dark:border-gray-700 ${
                focusedField === 'password' 
                  ? 'border-indigo-500 dark:border-indigo-500 shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' 
                  : 'hover:border-gray-400 dark:hover:border-gray-600'
              }`}
              placeholder="********"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {isRtl ? t('rememberMe') : loginText.rememberMe}
            </label>
          </div>
          
          <a href="#forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            {isRtl ? t('forgotPassword') : loginText.forgotPassword}
          </a>
        </div>
        
        <div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`group relative w-full btn btn-primary hover:shadow-lg py-3 ${
              isSubmitting ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className={`h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-transform duration-300 ${isSubmitting ? 'animate-spin' : 'group-hover:translate-x-1'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            {isSubmitting ? (isRtl ? t('loggingIn') : loginText.loggingIn) : (isRtl ? t('login') : loginText.login)}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              {isRtl ? t('orContinueWith') : loginText.orContinueWith}
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FaGoogle className="h-5 w-5 text-red-500" />
            <span className="ml-2">Google</span>
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FaFacebook className="h-5 w-5 text-blue-600" />
            <span className="ml-2">Facebook</span>
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isRtl ? t('noAccount') : loginText.noAccount}{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors hover:underline">
            {isRtl ? t('register') : loginText.register}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;