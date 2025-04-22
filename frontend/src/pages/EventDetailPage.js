import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import useRegistrationContext from '../contexts/registration/registrationContext';
import EventDetail from '../components/events/EventDetail';
import EventForm from '../components/events/EventForm';
import { formatDate } from '../utils/dateFormatter';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById, event, loading, updateEvent, deleteEvent } = useEventContext();
  const { user } = useAuthContext();
  const { registerForEvent, getUserRegistrationForEvent, registration } = useRegistrationContext();
  const [isEditing, setIsEditing] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  useEffect(() => {
    getEventById(id);
    
    if (user) {
      getUserRegistrationForEvent(id);
    }
  }, [id, user]);

  useEffect(() => {
    if (registration) {
      setRegistrationStatus(registration.status);
    } else {
      setRegistrationStatus(null);
    }
  }, [registration]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    await registerForEvent(id);
    setRegistrationStatus('pending');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      navigate('/events');
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Event not found</h2>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditing ? (
        <div>
          <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
          <EventForm 
            event={event} 
            isEditing={true} 
            onComplete={handleEditComplete} 
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            {user && user.role === 'admin' && (
              <div className="space-x-4">
                <button 
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <EventDetail event={event} />

          <div className="mt-8">
            {registrationStatus ? (
              <div className="border rounded-lg p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-4">Your Registration</h3>
                <div className="flex items-center">
                  <span className="mr-2">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    registrationStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                    registrationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {registrationStatus.charAt(0).toUpperCase() + registrationStatus.slice(1)}
                  </span>
                </div>
                {registrationStatus === 'pending' && (
                  <p className="mt-2 text-gray-600">Your registration is pending approval from the admin.</p>
                )}
                {registrationStatus === 'approved' && (
                  <p className="mt-2 text-gray-600">Your registration has been approved. We look forward to seeing you at the event!</p>
                )}
                {registrationStatus === 'rejected' && (
                  <p className="mt-2 text-gray-600">Your registration has been rejected. Please contact the administrator for more information.</p>
                )}
              </div>
            ) : (
              <div>
                {event.availableSpots > 0 ? (
                  <button 
                    onClick={handleRegister}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    disabled={!user}
                  >
                    Register for this Event
                  </button>
                ) : (
                  <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                    This event is fully booked.
                  </div>
                )}
                {!user && (
                  <p className="mt-2 text-gray-600">Please <a href="/login" className="text-blue-600 hover:underline">login</a> to register for this event.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;