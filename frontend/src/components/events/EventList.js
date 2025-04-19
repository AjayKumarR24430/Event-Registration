import React, { useContext, useEffect, useState } from 'react';
import EventContext from '../../contexts/event/eventContext';
import RtlContext from '../../contexts/rtl/rtlContext';
import EventItem from './EventItem';
import SearchEvents from './SearchEvents';
import { sortEventsByDate } from '../../utils/dateFormatter';

const EventList = () => {
  const eventContext = useContext(EventContext);
  const rtlContext = useContext(RtlContext);
  
  const { events, getEvents, loading, filtered } = eventContext;
  const { t } = rtlContext;
  
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
      <div className="mb-8">
        <SearchEvents />
      </div>
      
      {sortedEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">{t('noEventsFound')}</p>
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