import React, { useEffect, useState } from 'react';
import useEventContext from '../../contexts/event/eventContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import EventItem from './EventItem';
import { sortEventsByDate } from '../../utils/dateFormatter';

const EventList = () => {
  const { events, getEvents, loading, filtered } = useEventContext();
  const { t } = useRtlContext();
  
  const [sortedEvents, setSortedEvents] = useState([]);
  
  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (filtered) {
      setSortedEvents(sortEventsByDate(filtered));
    } else if (events) {
      setSortedEvents(sortEventsByDate(events));
    }
  }, [events, filtered]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

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