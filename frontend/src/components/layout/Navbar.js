import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthContext from '../../contexts/auth/authContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { 
  FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, 
  FaGlobe, FaMoon, FaSun, FaSearch, FaBell, FaInfoCircle, 
  FaEnvelope, FaQuestionCircle, FaGavel, FaChevronDown
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuthContext();
  const { isRtl, toggleRtl, t } = useRtlContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const onLogout = () => {
    logout();
    setIsOpen(false);
    setUserMenuOpen(false);
  };

  const NavLink = ({ to, children, icon: Icon, onClick }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link
        to={to}
        className={`nav-link group flex h-10 items-center px-3 text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'text-indigo-600 dark:text-indigo-400' 
            : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
        onClick={onClick || (() => setIsOpen(false))}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        <span>{children}</span>
        {isActive && (
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400"></span>
        )}
      </Link>
    );
  };

  const authLinks = (
    <div className={`lg:flex items-center gap-2 ${isOpen ? 'flex flex-col pt-4 pb-6 lg:pt-0 lg:pb-0' : 'hidden'} lg:flex-row`}>
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
  );

  const guestLinks = (
    <div className={`lg:flex items-center gap-2 ${isOpen ? 'flex flex-col pt-4 pb-6 lg:pt-0 lg:pb-0' : 'hidden'} lg:flex-row`}>
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
    </div>
  );

  const userArea = isAuthenticated ? (
    <div className="relative user-menu-container">
      <button 
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
          {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle className="h-6 w-6" />}
        </div>
        <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:block">
          {user?.name || t('Account')}
        </span>
        <FaChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {userMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 py-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 animate-scaleIn origin-top-right z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          
          {isAdmin && (
            <Link 
              to="/admin/events" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
              onClick={() => setUserMenuOpen(false)}
            >
              <FaCalendarAlt className="mr-2 h-4 w-4 text-indigo-500" />
              {t('Admin Dashboard')}
            </Link>
          )}
          
          <Link 
            to="/my-registrations" 
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
            onClick={() => setUserMenuOpen(false)}
          >
            <FaUserCircle className="mr-2 h-4 w-4 text-indigo-500" />
            {t('My Registrations')}
          </Link>
          
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            {t('Logout')}
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Link 
        to="/login"
        className="px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
      >
        {t('Login')}
      </Link>
      <Link 
        to="/register"
        className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
      >
        {t('Register')}
      </Link>
    </div>
  );

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass dark:glass-dark shadow-sm py-1.5' 
          : 'bg-gradient-to-r from-indigo-700/95 via-purple-700/95 to-fuchsia-700/95 backdrop-blur-sm py-1.5 text-white shadow-md shadow-indigo-600/10'
      }`}
    >
      <div className="container-custom flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link 
            to={user?.role === 'admin' ? '/admin/events' : '/'} 
            className="flex items-center gap-2 text-xl font-bold group"
            aria-label="Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
              <FaCalendarAlt className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className={`transform group-hover:scale-105 transition-transform duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
                : 'text-white font-bold'
            }`}>
              {t('EventHub')}
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="ml-8 hidden lg:block">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={toggleDarkMode} 
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                isScrolled
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-indigo-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <FaSun className="h-4 w-4 animate-scaleIn" />
              ) : (
                <FaMoon className="h-4 w-4 animate-scaleIn" />
              )}
            </button>

            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                isScrolled
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-indigo-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Search"
            >
              <FaSearch className="h-4 w-4" />
            </button>

            <button 
              onClick={() => toggleRtl()} 
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                isScrolled
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-indigo-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label={isRtl ? 'Switch to English' : 'Switch to Arabic'}
            >
              <FaGlobe className="h-4 w-4" />
            </button>

            {isAuthenticated && (
              <button 
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 relative ${
                  isScrolled
                    ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-indigo-400'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Notifications"
              >
                <FaBell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            )}
          </div>

          {/* User Area / Auth Buttons */}
          <div className="hidden sm:block">
            {userArea}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                isScrolled
                  ? 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-indigo-400'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? (
                <FaTimes className="h-5 w-5 animate-scaleIn" />
              ) : (
                <FaBars className="h-5 w-5 animate-scaleIn" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`container-custom transition-all duration-300 overflow-hidden ${showSearch ? 'h-12 opacity-100 py-2' : 'h-0 opacity-0 py-0'}`}>
        <div className="glass dark:glass-dark rounded-lg p-1 flex items-center">
          <FaSearch className="ml-2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchEvents')}
            className="w-full bg-transparent border-none outline-none px-2 py-1.5 text-gray-700 dark:text-gray-300 text-sm"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`container-custom lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col">
          {isAuthenticated ? authLinks : guestLinks}
          
          <div className="mt-4 space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            {!isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login"
                  className="w-full rounded-lg border border-indigo-600 px-4 py-2 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('Login')}
                </Link>
                <Link 
                  to="/register"
                  className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('Register')}
                </Link>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {isDarkMode ? (
                    <>
                      <FaSun className="h-4 w-4 text-amber-500" />
                      <span>{t('Light Mode')}</span>
                    </>
                  ) : (
                    <>
                      <FaMoon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{t('Dark Mode')}</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={toggleRtl}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <FaGlobe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{isRtl ? 'English' : 'العربية'}</span>
                </button>
              </div>
              
              {isAuthenticated && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  <span>{t('Logout')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;