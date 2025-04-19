import React, { useContext } from 'react';
import RtlContext from '../../contexts/rtl/rtlContext';

const Footer = () => {
  const rtlContext = useContext(RtlContext);
  const { isRtl, toggleRtl, t } = rtlContext;
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p>&copy; {currentYear} {t('welcomeMessage')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={toggleRtl} 
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-1 px-3 rounded-full text-sm transition duration-300"
            >
              {isRtl ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;