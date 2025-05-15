import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import EventForm from '../components/events/EventForm';
import EventManagement from '../components/admin/EventManagement';
import Spinner from '../components/layout/Spinner';

const AdminEventsPage = () => {
  const { getEvents, events, loading, deleteEvent } = useEventContext();
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      await getEvents();
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, [getEvents]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    if (isInitialLoad) {
      fetchEvents().then(() => {
        setIsInitialLoad(false);
      });
    }
  }, [isAuthenticated, user, navigate, isInitialLoad, fetchEvents]);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowAddForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        await fetchEvents(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleFormComplete = async () => {
    setShowAddForm(false);
    setEditingEvent(null);
    await fetchEvents(); // Refresh the list after adding/editing
  };

  if (isInitialLoad && loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button 
          onClick={handleAddEvent} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Add New Event
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          <EventForm 
            event={editingEvent} 
            isEditing={!!editingEvent} 
            onComplete={handleFormComplete} 
          />
        </div>
      )}
      
      {events && events.length > 0 ? (
        <EventManagement 
          events={events} 
          onEdit={handleEditEvent} 
          onDelete={handleDeleteEvent} 
        />
      ) : (
        <div className="text-center my-12">
          <p className="text-xl text-gray-600">No events found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;