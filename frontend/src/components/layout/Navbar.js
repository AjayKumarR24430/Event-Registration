import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthContext();
  const { isRtl, toggleRtl, t } = useRtlContext();
  const location = useLocation();
  
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <ul className="flex items-center space-x-4">
      {user && user.role === 'admin' ? (
        <>
          <li>
            <Link
              to="/admin/events"
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith('/admin/events') ? 'bg-gray-900' : ''
              }`}
            >
              {isRtl ? 'إدارة الفعاليات' : 'Event Management'}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/registrations"
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname.startsWith('/admin/registrations') ? 'bg-gray-900' : ''
              }`}
            >
              {isRtl ? 'إدارة التسجيلات' : 'Registration Management'}
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              to="/events"
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/events' ? 'bg-gray-900' : ''
              }`}
            >
              {isRtl ? 'الفعاليات' : 'Events'}
            </Link>
          </li>
          <li>
            <Link
              to="/my-registrations"
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/my-registrations' ? 'bg-gray-900' : ''
              }`}
            >
              {isRtl ? 'تسجيلاتي' : 'My Registrations'}
            </Link>
          </li>
        </>
      )}
      <li>
        <button
          onClick={onLogout}
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          {isRtl ? 'تسجيل خروج' : 'Logout'}
        </button>
      </li>
      <li>
        <button 
          onClick={toggleRtl} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          {isRtl ? 'English' : 'العربية'}
        </button>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="flex items-center space-x-4">
      <li>
        <Link 
          to="/register" 
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          {t('register')}
        </Link>
      </li>
      <li>
        <Link 
          to="/login" 
          className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          {t('login')}
        </Link>
      </li>
      <li>
        <button 
          onClick={toggleRtl} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          {isRtl ? 'English' : 'العربية'}
        </button>
      </li>
    </ul>
  );

  return (
    <nav className="bg-primary-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'admin' ? '/admin/events' : '/'} className="text-white text-xl font-bold">
            {t('welcomeMessage')}
          </Link>
          
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;