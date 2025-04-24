import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, isUpcoming } from '../../utils/dateFormatter';
import useRtlContext from '../../contexts/rtl/rtlContext';

const EventItem = ({ event }) => {
  const rtlContext = useRtlContext();
  const { t } = rtlContext;
  
  const { _id, title, description, date, location, availableSpots, capacity } = event;
  
  const isFull = availableSpots === 0;
  const isEventUpcoming = isUpcoming(date);
  
  let statusClass = 'bg-green-100 text-green-800';
  let statusText = `${availableSpots} ${t('Spots Left')}`;
  
  if (isFull) {
    statusClass = 'bg-red-100 text-red-800';
    statusText = t('eventFull');
  } else if (availableSpots <= 5) {
    statusClass = 'bg-yellow-100 text-yellow-800';
  }
  
  if (!isEventUpcoming) {
    statusClass = 'bg-gray-100 text-gray-800';
    statusText = t('eventPassed');
  }

  return (
    <div className="card hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-semibold mb-2 text-primary-700">{title}</h3>
      
      <p className="text-gray-600 mb-4 line-clamp-2">
        {description.length > 100 ? `${description.substring(0, 100)}...` : description}
      </p>
      
      <div className="mb-3">
        <p className="text-gray-700">
          <span className="font-medium">{t('eventDate')}:</span> {formatDate(date)}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">{t('eventLocation')}:</span> {location}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">{t('capacity')}:</span> {capacity}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
          {statusText}
        </span>
        
        <Link 
          to={`/events/${_id}`} 
          className="btn-primary text-sm py-1 px-3"
        >
          {t('viewEvent')}
        </Link>
      </div>
    </div>
  );
};

export default EventItem;