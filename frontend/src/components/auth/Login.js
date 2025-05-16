import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';

const Login = () => {
  const { login, error, clearErrors, isAuthenticated, user } = useAuthContext();
  const { t } = useRtlContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
          {t('login')}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              {t('email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              disabled={isSubmitting}
              className="form-input"
              placeholder="email@example.com"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {t('password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              disabled={isSubmitting}
              className="form-input"
              placeholder="********"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Logging in...' : t('login')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;