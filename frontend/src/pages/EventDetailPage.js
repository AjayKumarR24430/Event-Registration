import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import useRegistrationContext from '../contexts/registration/registrationContext';
import Spinner from '../components/layout/Spinner';
import { Link } from 'react-router-dom';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, currentEvent, loading: eventLoading, error: eventError } = useEventContext();
  const { user, isAuthenticated } = useAuthContext();
  const { registerForEvent, getUserRegistrationForEvent, current: registration, loading: registrationLoading } = useRegistrationContext();
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Load event data
  useEffect(() => {
    const loadEventData = async () => {
      try {
        const event = await getEvent(id);
        if (!event) {
          setLoadError('Event not found');
          return;
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setLoadError(err.response?.data?.error || 'Failed to load event');
      }
    };
    loadEventData();
  }, [id, getEvent]);

  // Load registration status
  useEffect(() => {
    const loadRegistrationStatus = async () => {
      if (isAuthenticated && user) {
        await getUserRegistrationForEvent(id);
      }
    };
    loadRegistrationStatus();
  }, [id, isAuthenticated, user, getUserRegistrationForEvent]);

  // Update registration status when registration changes
  useEffect(() => {
    setRegistrationStatus(registration?.status || null);
  }, [registration]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    try {
      const result = await registerForEvent(id);
      if (result && result.success === false) {
        if (result.status) {
          setRegistrationStatus(result.status);
        }
      } else {
        setRegistrationStatus('pending');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  if (!isAuthenticated && eventLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated && (eventLoading || registrationLoading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (loadError || eventError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{loadError || eventError}</span>
        </div>
        <Link to="/events" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          ← Back to Events
        </Link>
      </div>
    );
  }

  if (!currentEvent) {
    return null;
  }

  const getRegistrationStatusUI = () => {
    if (!isAuthenticated) {
      return {
        containerClass: 'bg-gray-50 border border-gray-200',
        icon: '👋',
        title: 'Want to Join?',
        message: 'Login to register for this event',
        actionButton: (
          <button
            onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
            className="mt-4 w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-200 text-lg font-medium"
          >
            Login to Register
          </button>
        )
      };
    }

    if (registrationStatus === 'approved') {
      return {
        containerClass: 'bg-green-50 border border-green-200',
        icon: '✓',
        title: 'You\'re Going!',
        message: 'Your registration has been approved. We look forward to seeing you at the event!',
        subMessage: `Event Date: ${new Date(currentEvent.date).toLocaleDateString()}`
      };
    }

    if (registrationStatus === 'pending') {
      return {
        containerClass: 'bg-yellow-50 border border-yellow-200',
        icon: '⏳',
        title: 'Registration Pending',
        message: 'Your registration is currently under review.',
        subMessage: 'We\'ll notify you once it\'s approved.'
      };
    }

    if (registrationStatus === 'rejected') {
      return {
        containerClass: 'bg-red-50 border border-red-200',
        icon: '✕',
        title: 'Registration Not Approved',
        message: 'Unfortunately, your registration was not approved.',
        subMessage: 'Please contact support for more information.'
      };
    }

    if (currentEvent.availableSpots <= 0) {
      return {
        containerClass: 'bg-red-50 border border-red-200',
        icon: '🚫',
        title: 'Event Full',
        message: 'Sorry, this event is fully booked.',
        subMessage: 'Please check back later or explore other events.'
      };
    }

    return {
      containerClass: 'bg-blue-50 border border-blue-200',
      icon: '🎟️',
      title: 'Spots Available',
      message: `${currentEvent.availableSpots} spots remaining`,
      actionButton: (
        <button
          onClick={handleRegister}
          className="mt-4 w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-200 text-lg font-medium"
        >
          Register for Event
        </button>
      )
    };
  };

  const statusUI = getRegistrationStatusUI();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">{currentEvent.title}</h1>
          
          {/* Registration Status Section - Prominent at the top */}
          <div className={`mb-8 p-6 rounded-lg ${statusUI.containerClass}`}>
            <div className="text-center">
              <div className="text-4xl mb-3">{statusUI.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{statusUI.title}</h2>
              <p className="text-lg mb-2">{statusUI.message}</p>
              {statusUI.subMessage && (
                <p className="text-sm opacity-75">{statusUI.subMessage}</p>
              )}
              {statusUI.actionButton}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">{currentEvent.description}</p>
            </div>

            {/* Sidebar */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{new Date(currentEvent.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{currentEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{currentEvent.category}</p>
                  </div>
                  {currentEvent.price && (
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-medium">${currentEvent.price}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;