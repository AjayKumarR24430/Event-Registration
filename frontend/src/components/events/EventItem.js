import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, isUpcoming } from '../../utils/dateFormatter';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaHeart, 
  FaShare, FaTicketAlt, FaBookmark, FaRegBookmark, FaRegHeart,
  FaStar, FaEye, FaFireAlt, FaArrowRight
} from 'react-icons/fa';

const EventItem = ({ event }) => {
  const rtlContext = useRtlContext();
  const { t } = rtlContext;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  
  const { _id, title, description, date, location, availableSpots, capacity, imageUrl, price, category } = event;
  
  const isFull = availableSpots === 0;
  const isEventUpcoming = isUpcoming(date);
  
  let statusClass = 'badge-success';
  let statusText = `${availableSpots} ${t('Spots Left')}`;
  
  if (isFull) {
    statusClass = 'badge-danger';
    statusText = t('eventFull');
  } else if (availableSpots <= 5) {
    statusClass = 'badge-warning';
  }
  
  if (!isEventUpcoming) {
    statusClass = 'badge-info';
    statusText = t('Event Passed');
  }

  // Calculate random popularity score between 80-99%
  const popularityScore = Math.floor(Math.random() * 20) + 80;

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    
    // Add heart burst animation
    if (!isLiked) {
      const heart = document.createElement('div');
      heart.className = 'heart-burst';
      e.currentTarget.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  // 3D tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
    
    // Update CSS variables for spotlight effect
    cardRef.current.style.setProperty('--x', `${x * 100}%`);
    cardRef.current.style.setProperty('--y', `${y * 100}%`);
    
    // Calculate tilt based on mouse position
    const tiltX = (y - 0.5) * 10; // Max tilt of 5 degrees
    const tiltY = (0.5 - x) * 10;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  return (
    <div 
      ref={cardRef}
      className="card-3d group backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden animate-scaleIn spotlight"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
      </div>
      
      {/* Event Image with Overlay */}
      <div className="relative h-56 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl shadow-inner">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
          alt={title}
          className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 filter saturate-150' : ''}`}
        />
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-70'
          }`} 
        />
        
        {/* Trending indicator */}
        {popularityScore > 90 && (
          <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
            <div className="absolute transform rotate-45 bg-gradient-to-r from-red-500 to-pink-500 text-white py-1 left-[-30px] top-[20px] w-[140px] text-center text-xs font-semibold shadow-lg">
              <FaFireAlt className="inline-block mr-1 animate-pulse" size={10} />
              {t('Trending')}
            </div>
          </div>
        )}

        {/* Category Badge with animated gradient */}
        <div className="absolute top-4 left-4 transform transition-transform duration-300 hover:scale-110 z-10">
          <span className="badge gradient-border">
            {category}
          </span>
        </div>

        {/* Status Badge with pulse effect */}
        <div className="absolute top-4 right-4 transform transition-transform duration-300 hover:scale-110 z-10">
          <span className={`badge ${statusClass} ${!isFull && availableSpots <= 5 ? 'animate-pulse' : ''}`}>
            {statusText}
          </span>
        </div>

        {/* Quick Actions */}
        <div 
          className={`absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 backdrop-blur-md bg-black/40 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
          }`}
        >
          <div className="flex gap-3">
            <button 
              className={`p-2 rounded-full backdrop-blur-md ${isLiked ? 'bg-red-500/20' : 'bg-white/20'} hover:bg-white/30 transition-all duration-300 ${isLiked ? 'scale-110' : 'hover:scale-110'}`}
              onClick={handleLike}
              title={t('addToWishlist')}
            >
              {isLiked ? (
                <FaHeart className="w-5 h-5 text-red-500 animate-heartbeat" />
              ) : (
                <FaRegHeart className="w-5 h-5 text-white" />
              )}
            </button>
            <button 
              className={`p-2 rounded-full backdrop-blur-md ${isSaved ? 'bg-indigo-500/20' : 'bg-white/20'} hover:bg-white/30 transition-all duration-300 ${isSaved ? 'scale-110' : 'hover:scale-110'}`}
              onClick={handleSave}
              title={t('saveEvent')}
            >
              {isSaved ? (
                <FaBookmark className="w-5 h-5 text-indigo-500" />
              ) : (
                <FaRegBookmark className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-white text-xs">
              <FaEye className="w-4 h-4 mr-1" />
              {Math.floor(Math.random() * 500) + 100}
            </div>
            <Link 
              to={`/events/${_id}`} 
              className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 shadow-lg shadow-indigo-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <FaTicketAlt className="w-4 h-4 mr-1" />
              {price > 0 ? `$${price}` : t('free')}
            </Link>
          </div>
        </div>
      </div>

      {/* Event Content with 3D depth effect */}
      <div className="card-3d-content space-y-4">
        {/* Title and description */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-pink-500 transition-all duration-500 line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center">
              <FaStar className="w-4 h-4 text-yellow-500" />
              <span className="text-sm ml-1 text-gray-700 dark:text-gray-300">{(Math.random() * (5 - 4.2) + 4.2).toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm mt-2">
            {description}
          </p>
        </div>
        
        {/* Progress bar for seats filling */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">{t('Filling Fast')}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{Math.floor((capacity - availableSpots) / capacity * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000" 
              style={{ width: `${(capacity - availableSpots) / capacity * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Event Details with hover effects */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300 group/item hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3 group-hover/item:bg-indigo-200 dark:group-hover/item:bg-indigo-800 transition-colors duration-300">
              <FaCalendarAlt className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover/item:scale-110 transition-transform duration-200" />
            </div>
            <span className="text-sm">{formatDate(date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 group/item hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mr-3 group-hover/item:bg-emerald-200 dark:group-hover/item:bg-emerald-800 transition-colors duration-300">
              <FaMapMarkerAlt className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover/item:scale-110 transition-transform duration-200" />
            </div>
            <span className="text-sm truncate">{location}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300 group/item hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-3 group-hover/item:bg-amber-200 dark:group-hover/item:bg-amber-800 transition-colors duration-300">
              <FaUsers className="w-4 h-4 text-amber-500 dark:text-amber-400 group-hover/item:scale-110 transition-transform duration-200" />
            </div>
            <span className="text-sm truncate">
              {t('Capacity')}: {capacity} • {availableSpots} {t('available')}
            </span>
          </div>
        </div>

        {/* Action Button with animated gradient border */}
        <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center text-gray-500 dark:text-gray-400 group/status">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              isEventUpcoming ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <FaClock className={`w-3 h-3 transition-all duration-300 ${
                isEventUpcoming ? 'text-green-500 group-hover/status:rotate-180' : 'text-red-500 group-hover/status:-rotate-180'
              }`} />
            </div>
            <span className="text-sm">{isEventUpcoming ? t('Upcoming') : t('Ended')}</span>
          </div>
          <Link 
            to={`/events/${_id}`} 
            className="gradient-border rounded-xl py-2 px-4 font-medium text-sm z-10 relative overflow-hidden group/btn inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative z-10 flex items-center">{t('View Details')} <FaArrowRight className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" /></span>
          </Link>
        </div>
      </div>
      
      {/* Floating price tag for non-free events */}
      {price > 0 && (
        <div className="absolute top-16 -right-2 transform rotate-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-1 px-3 rounded shadow-lg z-10 animate-float">
          <div className="text-xs font-bold">${price}</div>
        </div>
      )}
    </div>
  );
};

export default EventItem;