import React, { useEffect, useState } from 'react';
import useRtlContext from '../../contexts/rtl/rtlContext';
import EventItem from './EventItem';
import { sortEventsByDate } from '../../utils/dateFormatter';

const EventList = ({ events }) => {
  const { t } = useRtlContext();
  const [sortedEvents, setSortedEvents] = useState([]);
  
  useEffect(() => {
    if (events) {
      setSortedEvents(sortEventsByDate(events));
    }
  }, [events]);

  return (
    <div>      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">{t('No Events Found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map(event => (
            <EventItem key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;