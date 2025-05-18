import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaGithub, FaTwitter, FaLinkedin, FaHeart, FaEnvelope, 
  FaMapMarkerAlt, FaPhoneAlt, FaArrowRight, FaInstagram, FaDiscord,
  FaCalendarAlt, FaStar, FaChevronRight, FaCheck
} from 'react-icons/fa';
import useRtlContext from '../../contexts/rtl/rtlContext';

const Footer = () => {
  const { t, isRtl } = useRtlContext();
  const location = useLocation();
  
  const currentYear = new Date().getFullYear();

  // Scroll to top when path changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Custom Link component that scrolls to top
  const ScrollToTopLink = ({ to, children, className }) => (
    <Link 
      to={to} 
      className={className}
      onClick={() => window.scrollTo(0, 0)}
    >
      {children}
    </Link>
  );

  const socialLinks = [
    { icon: FaTwitter, url: 'https://twitter.com', color: 'bg-blue-500' },
    { icon: FaLinkedin, url: 'https://linkedin.com', color: 'bg-blue-700' },
    { icon: FaInstagram, url: 'https://instagram.com', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500' },
    { icon: FaDiscord, url: 'https://discord.com', color: 'bg-indigo-600' },
    { icon: FaGithub, url: 'https://github.com', color: 'bg-gray-800' }
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

  const features = [
    { text: "Seamless event registration" },
    { text: "Automated attendee management" },
    { text: "Real-time data analytics" },
    { text: "Mobile-friendly experience" },
    { text: "Secure payment processing" },
    { text: "24/7 customer support" }
  ];

  return (
    <footer className="relative pt-32 mt-16 overflow-hidden">
      {/* Top Section with Gradient */}
      <div className="bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-800 pb-6 relative">
        {/* Radial circles for decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-700 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-600 rounded-full opacity-10 blur-3xl"></div>
        </div>
      
        <div className="container-custom relative z-10 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-white">
            {/* Main Info */}
            <div className="md:col-span-4 space-y-6">
              <ScrollToTopLink to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <FaCalendarAlt className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold text-white">
                  EventHub
                </span>
              </ScrollToTopLink>
              
              <p className="text-indigo-100 leading-relaxed">
                {isRtl ? t('footerTagline') : footerContent.tagline}
              </p>
              
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${social.color} hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/20`}
                      aria-label={`Follow us on ${social.url.split('.com')[0].split('https://')[1]}`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="md:col-span-2 space-y-5">
              <h3 className="text-lg font-semibold text-white">
                {isRtl ? t('quickLinks') : footerContent.quickLinks}
              </h3>
              <ul className="space-y-3">
                {[
                  { name: isRtl ? t('allEvents') : footerContent.allEvents, path: '/events' },
                  { name: isRtl ? t('about') : footerContent.about, path: '/about' },
                  { name: isRtl ? t('contact') : footerContent.contact, path: '/contact' },
                  { name: isRtl ? t('faq') : footerContent.faq, path: '/faq' }
                ].map((link, index) => (
                  <li key={index}>
                    <ScrollToTopLink 
                      to={link.path} 
                      className="text-indigo-200 hover:text-white transition-colors duration-200 flex items-center"
                    >
                      <FaChevronRight className="w-3 h-3 mr-2 opacity-70" />
                      <span>{link.name}</span>
                    </ScrollToTopLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="md:col-span-2 space-y-5">
              <h3 className="text-lg font-semibold text-white">
                {isRtl ? t('legal') : footerContent.legal}
              </h3>
              <ul className="space-y-3">
                {[
                  { name: isRtl ? t('privacy') : footerContent.privacy, path: '/legal' },
                  { name: isRtl ? t('terms') : footerContent.terms, path: '/legal' },
                  { name: isRtl ? t('cookies') : footerContent.cookies, path: '/legal' },
                  { name: isRtl ? t('licensing') : footerContent.licensing, path: '/legal' }
                ].map((link, index) => (
                  <li key={index}>
                    <ScrollToTopLink 
                      to={link.path} 
                      className="text-indigo-200 hover:text-white transition-colors duration-200 flex items-center"
                    >
                      <FaChevronRight className="w-3 h-3 mr-2 opacity-70" />
                      <span>{link.name}</span>
                    </ScrollToTopLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Features */}
            <div className="md:col-span-4 space-y-5">
              <h3 className="text-lg font-semibold text-white">
                {isRtl ? t('contactUs') : footerContent.contactUs}
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="w-4 h-4 text-indigo-300 mt-1 mr-3" />
                  <span className="text-indigo-200">123 Event Street, City 10001</span>
                </li>
                <li className="flex items-center">
                  <FaPhoneAlt className="w-4 h-4 text-indigo-300 mr-3" />
                  <span className="text-indigo-200">+1 (234) 567-8900</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="w-4 h-4 text-indigo-300 mr-3" />
                  <span className="text-indigo-200">contact@eventhub.com</span>
                </li>
              </ul>
              
              {/* Newsletter */}
              <div className="mt-6 pt-6 border-t border-indigo-800/50">
                <h4 className="font-medium text-white mb-3">
                  {isRtl ? t('stayUpdated') : footerContent.stayUpdated}
                </h4>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder={isRtl ? t('yourEmail') : footerContent.yourEmail} 
                    className="w-full bg-indigo-800/50 backdrop-blur-sm border border-indigo-700 rounded-l-lg px-3 py-2 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-r-lg transition-all duration-200 group">
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-12 py-8 border-t border-indigo-800/30">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-indigo-200 text-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-700/50 flex items-center justify-center mr-2">
                    <FaCheck className="w-3 h-3 text-indigo-300" />
                  </div>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-indigo-950 py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-indigo-300">
            <p>
              © {currentYear} EventHub. {isRtl ? t('allRightsReserved') : footerContent.allRightsReserved}
            </p>
            <p className="flex items-center mt-4 md:mt-0 group">
              {isRtl ? t('madeWith') : footerContent.madeWith} 
              <FaHeart className="w-4 h-4 text-pink-500 mx-2 animate-pulse group-hover:scale-125 transition-transform duration-300" /> 
              {isRtl ? t('by') : footerContent.by} <span className="font-medium text-indigo-200 ml-1">EventHub Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;