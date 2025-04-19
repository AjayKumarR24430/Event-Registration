import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';
import RtlContext from '../../contexts/rtl/rtlContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const rtlContext = useContext(RtlContext);
  
  const { isAuthenticated, logout, user } = authContext;
  const { isRtl, toggleRtl, t } = rtlContext;
  
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li className="mx-2">
        <Link to="/my-registrations" className="text-white hover:text-gray-300">
          {t('myRegistrations')}
        </Link>
      </li>
      {isAdmin && (
        <>
          <li className="mx-2">
            <Link to="/admin/events" className="text-white hover:text-gray-300">
              {t('admin')} {t('events')}
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/admin/registrations" className="text-white hover:text-gray-300">
              {t('admin')} {t('myRegistrations')}
            </Link>
          </li>
        </>
      )}
      <li className="mx-2">
        <a onClick={onLogout} href="#!" className="text-white hover:text-gray-300 cursor-pointer">
          <span className="hidden md:inline">{t('logout')}</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="mx-2">
        <Link to="/register" className="text-white hover:text-gray-300">
          {t('register')}
        </Link>
      </li>
      <li className="mx-2">
        <Link to="/login" className="text-white hover:text-gray-300">
          {t('login')}
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-primary-700 py-4">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        <Link to="/" className="text-white text-xl font-bold">
          {t('welcomeMessage')}
        </Link>
        
        <ul className="flex items-center">
          <li className="mx-2">
            <Link to="/" className="text-white hover:text-gray-300">
              {t('home')}
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/events" className="text-white hover:text-gray-300">
              {t('events')}
            </Link>
          </li>
          {isAuthenticated ? authLinks : guestLinks}
          
          {/* RTL Toggle Button */}
          <li className="ml-4">
            <button 
              onClick={toggleRtl} 
              className="bg-primary-600 hover:bg-primary-800 text-white font-bold py-1 px-3 rounded-full text-sm transition duration-300"
            >
              {isRtl ? 'English' : 'العربية'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;