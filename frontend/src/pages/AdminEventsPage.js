import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import EventForm from '../components/events/EventForm';
import EventManagement from '../components/admin/EventManagement';
import Spinner from '../components/layout/Spinner';

const AdminEventsPage = () => {
  const { getEvents, events, loading } = useEventContext();
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      getEvents().then(() => {
        setIsInitialLoad(false);
      });
    }
  }, [isAuthenticated, user, navigate, isInitialLoad, getEvents]);

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
    <>
      {showAddForm && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 p-6 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            <EventForm 
              event={editingEvent} 
              isEditing={!!editingEvent} 
              onComplete={() => {
                setShowAddForm(false);
                setEditingEvent(null);
              }} 
            />
          </div>
        </div>
      )}
      
      {!showAddForm && <EventManagement />}
    </>
  );
};

export default AdminEventsPage;