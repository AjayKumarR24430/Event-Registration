import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';

const Home = () => {
  const { events, loading } = useEventContext();

  useEffect(() => {
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Event Registration System</h1>
        <p className="text-xl mb-6">Find and register for upcoming events</p>
        <Link to="/events" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
          Browse All Events
        </Link>
      </div>

      <div className="my-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Events</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="loader">Loading...</div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map(event => (
              <div key={event._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="mb-4">{event.description.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${event.availableSpots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {event.availableSpots > 0 ? `${event.availableSpots} spots left` : 'Sold out'}
                    </span>
                    <Link to={`/events/${event._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No featured events available</p>
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