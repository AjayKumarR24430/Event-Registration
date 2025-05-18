import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useAuthContext from '../../contexts/auth/authContext';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaTag, 
  FaClock, FaEdit, FaHeart, FaShare, FaTicketAlt, FaStar,
  FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaPlus,
  FaMoon, FaSun, FaCamera, FaImages, FaRegHeart, FaChevronLeft,
  FaChevronRight, FaGlobe, FaVideo, FaPhoneAlt, FaEnvelope, FaComments,
  FaCheck, FaInfoCircle, FaShieldAlt, FaTasks, FaUserFriends
} from 'react-icons/fa';

// Share Button Component
const ShareButton = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`btn btn-outline flex items-center gap-2 ${color} transition-all duration-300 hover:scale-105`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const eventContext = useEventContext();
  const authContext = useAuthContext();
  const registrationContext = useRegistrationContext();
  const rtlContext = useRtlContext();
  
  const { getEvent, event, loading } = eventContext;
  const { isAuthenticated, user } = authContext;
  const { registerForEvent, getUserRegistrations, myRegistrations, error, clearRegistration } = registrationContext;
  const { isRtl, t } = rtlContext;
  
  const [alert, setAlert] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [isLiked, setIsLiked] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  
  // Track scroll progress
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;
    
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    setScrollProgress(scrollPercent);
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Create parallax effect on hero section
  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    };
    
    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  useEffect(() => {
    getEvent(id);
    
    if (isAuthenticated) {
      getUserRegistrations();
    }
    
    // eslint-disable-next-line
  }, [id, isAuthenticated]);
  
  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: error });
      clearRegistration();
    }
    
    if (myRegistrations && myRegistrations.length > 0 && event) {
      const registration = myRegistrations.find(
        reg => {
          const eventId = typeof reg.event === 'object' ? reg.event._id : reg.event;
          return eventId === event._id;
        }
      );
      
      if (registration) {
        setAlreadyRegistered(true);
        if (registration.status === 'pending') {
          setAlert({ 
            type: 'info', 
            message: t('registrationPending')
          });
        }
      } else {
        setAlreadyRegistered(false);
      }
    }
    
    // eslint-disable-next-line
  }, [error, myRegistrations, event]);
  
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    try {
      await registerForEvent(id);
      setAlert({ 
        type: 'success', 
        message: t('registrationSubmitted')
      });
      setAlreadyRegistered(true);
      
      // Show confetti celebration for successful registration
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      
      // Increment attendee count
      setAttendeeCount(prev => prev + 1);
    } catch (err) {
      setAlert({ 
        type: 'error', 
        message: err.response?.data?.error || t('registrationError')
      });
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', options);
  };
  
  const isEventPassed = (dateString) => {
    const eventDate = new Date(dateString);
    const currentDate = new Date();
    return eventDate < currentDate;
  };

  const getDaysUntilEvent = (dateString) => {
    const eventDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = eventDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
    
    // Add heart animation when liking
    if (!isLiked) {
      const heart = document.createElement('div');
      heart.className = 'heart-burst';
      document.getElementById('likeButton').appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  };
  
  const handleImageClick = (image) => {
    setSelectedImage(image);
    
    // Add zoom in animation
    document.querySelector('.zoomed-image-container').classList.add('animate-scaleIn');
  };
  
  const closeImageViewer = () => {
    // Add zoom out animation before closing
    const container = document.querySelector('.zoomed-image-container');
    if (container) {
      container.classList.remove('animate-scaleIn');
      container.classList.add('animate-fadeOut');
      setTimeout(() => {
        setSelectedImage(null);
      }, 300);
    } else {
      setSelectedImage(null);
    }
  };
  
  const handleNextCarouselSlide = () => {
    const relatedEvents = [...mockedRelatedEvents, ...mockedRelatedEvents];
    setCarouselIndex((prevIndex) => (prevIndex + 1) % (relatedEvents.length / 2));
  };
  
  const handlePrevCarouselSlide = () => {
    const relatedEvents = [...mockedRelatedEvents, ...mockedRelatedEvents];
    setCarouselIndex((prevIndex) => (prevIndex - 1 + relatedEvents.length / 2) % (relatedEvents.length / 2));
  };

  // Create confetti elements
  const createConfetti = () => {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 1.5}s`;
      
      confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 4000);
  };
  
  if (loading || !event) {
    return <Spinner />;
  }
  
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const hasAvailableSpots = event.availableSpots > 0;
  const isPastEvent = isEventPassed(event.date);
  const daysUntilEvent = getDaysUntilEvent(event.date);
  
  const getStatusBadge = () => {
    if (isPastEvent) return <span className="badge badge-info">{t('eventPassed')}</span>;
    if (!hasAvailableSpots) return <span className="badge badge-danger">{t('soldOut')}</span>;
    if (event.availableSpots <= 5) return <span className="badge badge-warning">{`${event.availableSpots} ${t('spotsLeft')}`}</span>;
    return <span className="badge badge-success">{`${event.availableSpots} ${t('spotsAvailable')}`}</span>;
  };

  // Mock data for image gallery and reviews
  const eventImages = [
    event.imageUrl,
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3'
  ].filter(Boolean);

  const mockedRelatedEvents = [
    { id: 1, title: 'Tech Conference 2023', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4', date: '2023-12-15', location: 'New York, NY', category: 'Technology', price: 199 },
    { id: 2, title: 'Music Festival Weekend', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329', date: '2023-11-20', location: 'Los Angeles, CA', category: 'Music', price: 149 },
    { id: 3, title: 'Startup Networking Event', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2', date: '2023-12-05', location: 'San Francisco, CA', category: 'Business', price: 0 },
    { id: 4, title: 'Annual Design Summit', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3', date: '2023-11-28', location: 'Chicago, IL', category: 'Design', price: 299 },
  ];
  
  const mockReviews = [
    { id: 1, name: 'Hiro S.', rating: 5, comment: 'Amazing event! The speakers were incredible and I learned so much.', avatar: 'https://i.pravatar.cc/150?img=anime1', date: '2023-10-15' },
    { id: 2, name: 'Yuki M.', rating: 4, comment: 'Well organized and great content. Would attend again!', avatar: 'https://i.pravatar.cc/150?img=anime2', date: '2023-10-12' },
    { id: 3, name: 'Takeshi K.', rating: 5, comment: "One of the best conferences I've attended this year. Excellent networking opportunities.", avatar: 'https://i.pravatar.cc/150?img=anime3', date: '2023-10-10' },
  ];

  // Show confetti if needed
  useEffect(() => {
    if (showConfetti) {
      createConfetti();
    }
  }, [showConfetti]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-indigo-600 z-50 transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
      
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      {/* Floating Action Menu */}
      <div className="floating-menu">
        <button 
          className="floating-menu-button animate-float shadow-lg shadow-indigo-500/30"
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
        >
          <FaPlus className={`w-6 h-6 transition-transform duration-500 ${showFloatingMenu ? 'rotate-45' : ''}`} />
        </button>
        
        <div className={`floating-menu-items ${showFloatingMenu ? 'active' : ''}`}>
          <button className="floating-menu-item" onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun className="w-5 h-5 text-amber-400 animate-spin" /> : <FaMoon className="w-5 h-5 text-indigo-600" />}
            <span className="text-gradient bg-gradient-to-r from-indigo-600 to-purple-600">
              {isDarkMode ? t('Light Mode') : t('Dark Mode')}
            </span>
          </button>
          <button className="floating-menu-item" onClick={() => setShowGallery(true)}>
            <FaImages className="w-5 h-5 text-emerald-500" />
            <span className="text-gradient bg-gradient-to-r from-emerald-500 to-teal-600">
              {t('View Gallery')}
            </span>
          </button>
          <button className="floating-menu-item" onClick={() => setShowShareMenu(!showShareMenu)}>
            <FaShare className="w-5 h-5 text-blue-500" />
            <span className="text-gradient bg-gradient-to-r from-blue-500 to-indigo-500">
              {t('Share')}
            </span>
          </button>
        </div>
      </div>

      {/* Hero Section with Parallax */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0" ref={heroRef}>
          <img 
            src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent opacity-80"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="particles">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="particle rounded-full bg-white animate-particle"
                style={{
                  width: "5px",
                  height: "5px",
                  left: `${i * 7}%`,
                  top: `${i * 6}%`,
                  animationDuration: "10s",
                  opacity: 0.5
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="container-custom h-full flex flex-col justify-end pb-16 relative z-10">
          <div className="flex flex-col gap-8">
            {/* Event type and category with animated badges */}
            <div className="flex flex-wrap gap-3">
              <div className="badge gradient-border animate-float">
                {event.category}
              </div>
              {getStatusBadge()}
              {isPastEvent ? null : (
                <div className="badge badge-info animate-pulse">
                  <FaCalendarAlt className="w-4 h-4 mr-1" />
                  {daysUntilEvent > 0 ? `${daysUntilEvent} ${t('Days Left')}` : t('Today')}
                </div>
              )}
            </div>
            
            {/* Title with gradient and animation */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fadeIn">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text inline-block pb-2">
                {event.title}
              </span>
            </h1>
            
            {/* Event meta information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white animate-slideUp">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-500/30 backdrop-blur-md flex items-center justify-center text-white">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-indigo-200 text-sm">{t('Location')}</div>
                  <div className="font-medium">{event.location}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/30 backdrop-blur-md flex items-center justify-center text-white">
                  <FaCalendarAlt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-purple-200 text-sm">{t('Date')}</div>
                  <div className="font-medium">{formatDate(event.date)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-pink-500/30 backdrop-blur-md flex items-center justify-center text-white">
                  <FaUsers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-pink-200 text-sm">{t('Attendance')}</div>
                  <div className="font-medium">{(event.capacity - event.availableSpots) || 0} / {event.capacity}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#f9fafb" fillOpacity="1" d="M0,224L80,208C160,192,320,160,480,165.3C640,171,800,213,960,218.7C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setShowGallery(false)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="gallery-grid">
              {eventImages.map((image, index) => (
                <div 
                  key={index}
                  className="gallery-item"
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`Event ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Selected event" 
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}

      {/* Share Menu */}
      {showShareMenu && (
        <div className="container-custom -mt-6 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg animate-slideIn">
            <h3 className="text-lg font-semibold mb-4">{t('Share This Event')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ShareButton 
                icon={FaFacebook} 
                label="Facebook" 
                color="hover:text-blue-600 hover:border-blue-600"
              />
              <ShareButton 
                icon={FaTwitter} 
                label="Twitter" 
                color="hover:text-sky-500 hover:border-sky-500"
              />
              <ShareButton 
                icon={FaLinkedin} 
                label="LinkedIn" 
                color="hover:text-blue-700 hover:border-blue-700"
              />
              <ShareButton 
                icon={FaWhatsapp} 
                label="WhatsApp" 
                color="hover:text-green-600 hover:border-green-600"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('About This Event')}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Event Highlights */}
            <div className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('Event Highlights')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t('Date & Time')}</h3>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t('Venue')}</h3>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FaUsers className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t('Attendance')}</h3>
                    <p className="text-gray-600">
                      {event.capacity} {t('Total Capacity')} • {event.availableSpots} {t('Available')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <FaDollarSign className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t('Pricing')}</h3>
                    <p className="text-gray-600">
                      {event.price > 0 ? `$${event.price.toFixed(2)}` : t('Free')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="lg:col-span-1">
            <div className="card space-y-6 sticky top-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{t('Registration')}</h3>
                {isAdmin && (
                  <button
                    onClick={() => navigate(`/admin/events/edit/${id}`)}
                    className="btn btn-outline p-2"
                    title={t('Edit Event')}
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span>{t('Price')}</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {event.price > 0 ? `$${event.price.toFixed(2)}` : t('Free')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-gray-600">
                  <span>{t('Available Spots')}</span>
                  <span className={hasAvailableSpots ? 'text-green-600' : 'text-red-600'}>
                    {hasAvailableSpots ? event.availableSpots : t('Sold Out')}
                  </span>
                </div>
              </div>
              
              {alreadyRegistered ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h3 className="text-blue-800 font-medium mb-2">{t('Already Registered')}</h3>
                  <p className="text-blue-600 text-sm">
                    {t('Check your registration status in your account')}
                  </p>
                </div>
              ) : isPastEvent ? (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <h3 className="text-gray-800 font-medium mb-2">{t('Event Closed')}</h3>
                  <p className="text-gray-600 text-sm">{t('Registration is no longer available')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleRegister}
                    disabled={!hasAvailableSpots || alreadyRegistered || isPastEvent || (isAdmin && !isAuthenticated)}
                    className={`btn w-full ${(!hasAvailableSpots || alreadyRegistered || isPastEvent) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'btn-primary'}`}
                  >
                    <FaTicketAlt className="w-5 h-5" />
                    {t('Register Now')}
                  </button>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-gray-500 text-center">
                      {t('Please log in to register for this event')}
                    </p>
                  )}
                </div>
              )}
              
              {/* Additional Information */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">{t('Additional Information')}</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <FaClock className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <span>{t('Registration Deadline')}: {formatDate(event.date)}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FaTag className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <span>{t('Category')}: {event.category}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events Carousel */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">{t('Similar Events')}</h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-6 carousel-animate">
              {[...mockedRelatedEvents, ...mockedRelatedEvents].map((event, index) => (
                <div 
                  key={`${event.id}-${index}`}
                  className="flex-shrink-0 w-72"
                >
                  <div className="card group cursor-pointer">
                    <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                      {event.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;