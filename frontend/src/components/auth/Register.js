import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';

const Register = () => {
  const { register, error, clearErrors, isAuthenticated } = useAuthContext();
  const { t } = useRtlContext();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
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
      setPasswordError(t('Passwords Do Not Match'));
    } else if (e.target.name === 'confirmPassword' && password === e.target.value) {
      setPasswordError('');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError(t('Passwords Do Not Match'));
    } else {
      register({
        username,
        email,
        password
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md card">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
          {t('register')}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              {t('username')}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
              className="form-input"
              placeholder={t('username')}
            />
          </div>
          
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
              className="form-input"
              placeholder="email@example.com"
            />
          </div>
          
          <div className="mb-4">
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
              minLength="6"
              className="form-input"
              placeholder="********"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              minLength="6"
              className="form-input"
              placeholder="********"
            />
            {passwordError && (
              <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              className="btn-primary w-full"
            >
              {t('register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;