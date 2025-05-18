import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, FaTwitter, FaLinkedin, FaHeart, FaEnvelope, 
  FaMapMarkerAlt, FaPhoneAlt, FaArrowRight, FaInstagram, FaDiscord
} from 'react-icons/fa';
import useRtlContext from '../../contexts/rtl/rtlContext';

const Footer = () => {
  const { t, isRtl } = useRtlContext();
  
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, url: 'https://github.com', color: 'hover:bg-gray-800' },
    { icon: FaTwitter, url: 'https://twitter.com', color: 'hover:bg-blue-400' },
    { icon: FaLinkedin, url: 'https://linkedin.com', color: 'hover:bg-blue-700' },
    { icon: FaInstagram, url: 'https://instagram.com', color: 'hover:bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500' },
    { icon: FaDiscord, url: 'https://discord.com', color: 'hover:bg-indigo-600' }
  ];
  
  // Fixed text content with proper capitalization
  const footerContent = {
    tagline: "Discover, register and participate in exciting events around you. Our platform makes event management seamless and enjoyable.",
    stayUpdated: "Stay Updated",
    yourEmail: "Your Email",
    subscribe: "Subscribe",
    quickLinks: "Quick Links",
    allEvents: "All Events",
    about: "About Us",
    contact: "Contact Us",
    faq: "FAQ",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    licensing: "Licensing",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    allRightsReserved: "All Rights Reserved",
    madeWith: "Made with",
    by: "by"
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 pt-16 pb-6 border-t border-indigo-100 dark:border-indigo-900/30">
      {/* Animated Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-x-full -bottom-40 h-[200px] opacity-20">
          <div className="w-[200%] h-full bg-indigo-500 rounded-[100%] animate-wave"></div>
        </div>
        <div className="absolute -inset-x-full -bottom-24 h-[200px] opacity-10">
          <div className="w-[200%] h-full bg-indigo-600 rounded-[100%] animate-wave-slow"></div>
        </div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400">
              {isRtl ? t('footerTagline') : footerContent.tagline}
            </p>
            
            {/* Newsletter */}
            <div className="card-glass py-4 px-5 rounded-xl">
              <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {isRtl ? t('stayUpdated') : footerContent.stayUpdated}
              </h4>
              <div className="flex items-center mt-3 relative">
                <input 
                  type="email" 
                  placeholder={isRtl ? t('yourEmail') : footerContent.yourEmail} 
                  className="w-full bg-white/50 dark:bg-gray-800/50 border border-indigo-100 dark:border-gray-700 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-r-lg transition-all duration-200 group">
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-900 dark:text-gray-100 relative inline-block">
              {isRtl ? t('quickLinks') : footerContent.quickLinks}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-indigo-600 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: isRtl ? t('allEvents') : footerContent.allEvents, path: '/events' },
                { name: isRtl ? t('about') : footerContent.about, path: '/about' },
                { name: isRtl ? t('contact') : footerContent.contact, path: '/contact' },
                { name: isRtl ? t('faq') : footerContent.faq, path: '/faq' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-900 dark:text-gray-100 relative inline-block">
              {isRtl ? t('legal') : footerContent.legal}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-indigo-600 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: isRtl ? t('privacy') : footerContent.privacy, path: '/legal' },
                { name: isRtl ? t('terms') : footerContent.terms, path: '/legal' },
                { name: isRtl ? t('cookies') : footerContent.cookies, path: '/legal' },
                { name: isRtl ? t('licensing') : footerContent.licensing, path: '/legal' }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-5 text-gray-900 dark:text-gray-100 relative inline-block">
              {isRtl ? t('contactUs') : footerContent.contactUs}
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-indigo-600 to-transparent"></span>
            </h3>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="w-5 h-5 text-indigo-500 mt-0.5 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">123 Event Street, City, Country</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="w-4 h-4 text-indigo-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="w-4 h-4 text-indigo-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">contact@eventhub.com</span>
              </li>
            </ul>
            
            <h4 className="text-sm font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">
              {isRtl ? t('followUs') : footerContent.followUs}
            </h4>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:text-white transition-all duration-300 transform hover:-translate-y-1 ${social.color}`}
                    aria-label={`Follow us on ${social.url.split('.com')[0].split('https://')[1]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-100 dark:border-gray-800 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              © {currentYear} EventHub. {isRtl ? t('allRightsReserved') : footerContent.allRightsReserved}
            </p>
            <p className="text-gray-500 dark:text-gray-400 flex items-center mt-4 md:mt-0 group">
              {isRtl ? t('madeWith') : footerContent.madeWith} 
              <FaHeart className="w-4 h-4 text-red-500 mx-2 animate-pulse group-hover:scale-125 transition-transform duration-300" /> 
              {isRtl ? t('by') : footerContent.by} <span className="font-medium text-indigo-600 dark:text-indigo-400 ml-1">EventHub Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;