import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { 
  FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, 
  FaGlobe, FaMoon, FaSun, FaSearch, FaBell, FaInfoCircle, 
  FaEnvelope, FaQuestionCircle, FaGavel
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthContext();
  const { isRtl, toggleRtl, t } = useRtlContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const onLogout = () => {
    logout();
    setIsOpen(false);
  };

  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link
        to={to}
        className={`nav-link group relative flex items-center overflow-hidden ${isActive ? 'nav-link-active' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        {Icon && <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />}
        <span className="relative z-10">{children}</span>
        <span className={`absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 transform transition-transform duration-300 ${isActive ? 'translate-x-0' : '-translate-x-full'} group-hover:translate-x-0 rounded-lg`}></span>
      </Link>
    );
  };

  const authLinks = (
    <div className={`lg:flex items-center gap-4 ${isOpen ? 'flex flex-col pt-4 pb-6 lg:pt-0 lg:pb-0' : 'hidden'} lg:flex-row`}>
      <div className="lg:flex items-center gap-2 w-full lg:w-auto">
        {isAdmin ? (
          <>
            <NavLink to="/admin/events" icon={FaCalendarAlt}>
              {t('Event Management')}
            </NavLink>
            <NavLink to="/admin/registrations" icon={FaUserCircle}>
              {t('Registration Management')}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/events" icon={FaCalendarAlt}>
              {t('Events')}
            </NavLink>
            <NavLink to="/my-registrations" icon={FaUserCircle}>
              {t('My Registrations')}
            </NavLink>
          </>
        )}
        <NavLink to="/about" icon={FaInfoCircle}>
          {t('About')}
        </NavLink>
        <NavLink to="/contact" icon={FaEnvelope}>
          {t('Contact')}
        </NavLink>
        <NavLink to="/faq" icon={FaQuestionCircle}>
          {t('FAQ')}
        </NavLink>
        <NavLink to="/legal" icon={FaGavel}>
          {t('Legal')}
        </NavLink>
      </div>
      
      <div className="lg:flex items-center gap-3 mt-4 lg:mt-0 w-full lg:w-auto">
        <button
          onClick={onLogout}
          className="btn btn-glass py-2 px-4 w-full lg:w-auto flex items-center justify-center gap-2 group"
        >
          <FaSignOutAlt className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          <span>{t('Logout')}</span>
        </button>
        
        <button 
          onClick={() => { toggleRtl(); setIsOpen(false); }}
          className="btn btn-glass py-2 px-4 w-full lg:w-auto flex items-center justify-center gap-2 group mt-2 lg:mt-0"
        >
          <FaGlobe className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          <span>{isRtl ? 'English' : 'العربية'}</span>
        </button>
      </div>
    </div>
  );

  const guestLinks = (
    <div className={`lg:flex items-center gap-4 ${isOpen ? 'flex flex-col pt-4 pb-6 lg:pt-0 lg:pb-0' : 'hidden'} lg:flex-row`}>
      <NavLink to="/events" icon={FaCalendarAlt}>
        {t('Events')}
      </NavLink>
      <NavLink to="/about" icon={FaInfoCircle}>
        {t('About')}
      </NavLink>
      <NavLink to="/contact" icon={FaEnvelope}>
        {t('Contact')}
      </NavLink>
      <NavLink to="/faq" icon={FaQuestionCircle}>
        {t('FAQ')}
      </NavLink>
      <NavLink to="/legal" icon={FaGavel}>
        {t('Legal')}
      </NavLink>
      <NavLink to="/register">
        {t('Register')}
      </NavLink>
      <NavLink to="/login">
        {t('Login')}
      </NavLink>
      <button 
        onClick={() => { toggleRtl(); setIsOpen(false); }}
        className="btn btn-glass py-2 px-4 w-full lg:w-auto flex items-center justify-center gap-2 group mt-2 lg:mt-0"
      >
        <FaGlobe className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
        <span>{isRtl ? 'English' : 'العربية'}</span>
      </button>
    </div>
  );

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass dark:glass-dark shadow-lg py-2' 
          : 'bg-gradient-to-r from-teal-500/95 to-blue-500/95 backdrop-blur-md py-4 text-white'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              to={user?.role === 'admin' ? '/admin/events' : '/'} 
              className="flex items-center gap-2 text-xl font-bold text-white dark:text-white group"
            >
              <FaCalendarAlt className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className={`transform group-hover:scale-105 transition-transform duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent' 
                  : 'text-white'
              }`}>
                {t('EventHub')}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={toggleDarkMode} 
                className={`p-2 rounded-full ${
                  isScrolled
                    ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } transition-colors duration-200`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 animate-scaleIn" />
                ) : (
                  <FaMoon className="w-5 h-5 animate-scaleIn" />
                )}
              </button>

              <button 
                onClick={() => setShowSearch(!showSearch)} 
                className={`p-2 rounded-full ${
                  isScrolled
                    ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } transition-colors duration-200`}
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {isAuthenticated && (
                <button 
                  className={`p-2 rounded-full ${
                    isScrolled
                      ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  } transition-colors duration-200 relative`}
                  aria-label="Notifications"
                >
                  <FaBell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full transform scale-110 animate-pulse"></span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full ${
                  isScrolled
                    ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } transition-colors duration-200 relative z-50`}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="sr-only">Toggle menu</span>
                {isOpen ? (
                  <FaTimes className="w-6 h-6 animate-scaleIn" />
                ) : (
                  <FaBars className="w-6 h-6 animate-scaleIn" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`mt-4 transition-all duration-300 overflow-hidden ${showSearch ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="glass dark:glass-dark rounded-xl p-1">
            <input
              type="text"
              placeholder={t('searchEvents')}
              className="w-full bg-transparent border-none outline-none px-4 py-2 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Desktop & Mobile Menu */}
        <div 
          className={`lg:block lg:mt-4 transition-all duration-300 overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 lg:max-h-max lg:opacity-100'
          }`}
        >
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;