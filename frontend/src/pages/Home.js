import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useRtlContext from '../contexts/rtl/rtlContext';
import Spinner from '../components/layout/Spinner';

const Home = () => {
  const { events, getEvents, loading } = useEventContext();
  const { isRtl } = useRtlContext();

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);

  const getFeaturedEvents = () => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {isRtl ? 'نظام تسجيل الفعاليات' : 'Event Registration System'}
        </h1>
        <p className="text-xl mb-6">
          {isRtl ? 'ابحث وسجل في الفعاليات القادمة' : 'Find and register for upcoming events'}
        </p>
        <Link 
          to="/events" 
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          {isRtl ? 'تصفح جميع الفعاليات' : 'Browse All Events'}
        </Link>
      </div>

      <div className="my-12">
        <h2 className="text-2xl font-semibold mb-6">
          {isRtl ? 'الفعاليات المميزة' : 'Featured Events'}
        </h2>
        
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFeaturedEvents().map(event => (
              <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">
                        {isRtl ? 'التاريخ:' : 'Date:'}{' '}
                      </span>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">
                        {isRtl ? 'الموقع:' : 'Location:'}{' '}
                      </span>
                      {event.location}
                    </p>
                  </div>
                  
                  <Link 
                    to={`/events/${event._id}`}
                    className="inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-200"
                  >
                    {isRtl ? 'عرض التفاصيل' : 'View Details'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && getFeaturedEvents().length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {isRtl ? 'لا توجد فعاليات قادمة حالياً' : 'No upcoming events at the moment'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-100 rounded-lg p-8 my-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="text-xl font-medium mb-2">Browse Events</h3>
            <p>Explore our collection of upcoming events and find ones that interest you.</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="text-xl font-medium mb-2">Register</h3>
            <p>Submit your registration for events you'd like to attend.</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="text-xl font-medium mb-2">Get Approved</h3>
            <p>Wait for admin approval and receive confirmation of your registration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;