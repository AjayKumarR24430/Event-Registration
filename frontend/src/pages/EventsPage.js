import React, { useEffect, useState } from 'react';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import EventList from '../components/events/EventList';
import SearchEvents from '../components/events/SearchEvents';
import EventForm from '../components/events/EventForm';

const EventsPage = () => {
  const { getEvents, events, loading } = useEventContext();
  const { user } = useAuthContext();
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    getEvents();
  }, []);

  const toggleAddEventForm = () => {
    setShowAddEventForm(!showAddEventForm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleDateFilter = (date) => {
    setDateFilter(date);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter ? 
      new Date(event.date).toLocaleDateString() === new Date(dateFilter).toLocaleDateString() : 
      true;
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        {user && user.role === 'admin' && (
          <button 
            onClick={toggleAddEventForm} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            {showAddEventForm ? 'Cancel' : 'Add New Event'}
          </button>
        )}
      </div>

      {showAddEventForm && user && user.role === 'admin' && (
        <div className="mb-8">
          <EventForm onComplete={() => setShowAddEventForm(false)} />
        </div>
      )}

      <div className="mb-8">
        <SearchEvents 
          onSearch={handleSearch} 
          onDateFilter={handleDateFilter} 
          currentSearchTerm={searchTerm}
          currentDateFilter={dateFilter}
        />
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <EventList events={filteredEvents} />
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center my-12">
          <p className="text-xl text-gray-600">No events found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;