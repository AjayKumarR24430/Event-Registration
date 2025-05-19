import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import useRegistrationContext from '../contexts/registration/registrationContext';
import Spinner from '../components/layout/Spinner';
import { Link } from 'react-router-dom';
import { 
  FaEdit, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTicketAlt, 
  FaCheck
} from 'react-icons/fa';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, currentEvent, loading: eventLoading, error: eventError } = useEventContext();
  const { user, isAuthenticated } = useAuthContext();
  const { registerForEvent, getUserRegistrationForEvent, current: registration, loading: registrationLoading } = useRegistrationContext();
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [loadError, setLoadError] = useState(null);
  
  const isAdmin = user?.role === 'admin';

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
      if (isAuthenticated && user && !isAdmin) {
        await getUserRegistrationForEvent(id);
      }
    };
    loadRegistrationStatus();
  }, [id, isAuthenticated, user, getUserRegistrationForEvent, isAdmin]);

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
    // For admin users, show admin controls instead of registration options
    if (isAdmin) {
      return {
        containerClass: 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm',
        icon: <FaCalendarAlt className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />,
        title: 'Admin Controls',
        message: 'You are viewing this event as an administrator',
        actionButton: (
          <div className="flex flex-col space-y-4 mt-6">
            <Link
              to={`/admin/events/${id}`}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
            >
              <FaEdit className="w-5 h-5" />
              <span>Edit Event</span>
            </Link>
            <Link
              to={`/admin/registrations?event=${id}`}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
            >
              <FaUsers className="w-5 h-5" />
              <span>View Registrations</span>
            </Link>
          </div>
        )
      };
    }

    if (!isAuthenticated) {
      return {
        containerClass: 'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm',
        icon: '👋',
        title: 'Join the Fun!',
        message: 'Login to register for this event',
        actionButton: (
          <button
            onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
            className="mt-6 w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
          >
            <FaCalendarAlt className="w-5 h-5" />
            Login to Register
          </button>
        )
      };
    }

    if (registrationStatus === 'approved') {
      return {
        containerClass: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-sm',
        icon: <FaCalendarAlt className="w-6 h-6 text-green-600 dark:text-green-300" />,
        title: 'You\'re Going!',
        message: 'Your registration has been approved. We look forward to seeing you at the event!',
        subMessage: `Event Date: ${new Date(currentEvent.date).toLocaleDateString()}`,
        actionButton: (
          <button
            className="mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
            disabled
          >
            <FaCalendarAlt className="w-5 h-5" />
            Registration Approved
          </button>
        )
      };
    }

    if (registrationStatus === 'pending') {
      return {
        containerClass: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl shadow-sm',
        icon: <FaCalendarAlt className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />,
        title: 'Registration Pending',
        message: 'Your registration is currently under review.',
        subMessage: 'We\'ll notify you once it\'s approved.',
        actionButton: (
          <button
            className="mt-6 w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-4 px-6 rounded-xl hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
            disabled
          >
            <FaCalendarAlt className="w-5 h-5" />
            Pending Review
          </button>
        )
      };
    }

    if (registrationStatus === 'rejected') {
      return {
        containerClass: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm',
        icon: <FaCalendarAlt className="w-6 h-6 text-red-600 dark:text-red-300" />,
        title: 'Registration Not Approved',
        message: 'Unfortunately, your registration was not approved.',
        subMessage: 'Please contact support for more information.',
        actionButton: (
          <button
            className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
            onClick={() => navigate('/contact')}
          >
            <FaCalendarAlt className="w-5 h-5" />
            Contact Support
          </button>
        )
      };
    }

    if (currentEvent.availableSpots <= 0) {
      return {
        containerClass: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl shadow-sm',
        icon: <FaCalendarAlt className="w-6 h-6 text-red-600 dark:text-red-300" />,
        title: 'Event Full',
        message: 'Sorry, this event is fully booked.',
        subMessage: 'Please check back later or explore other events.',
        actionButton: (
          <button
            className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
            onClick={() => navigate('/events')}
          >
            <FaCalendarAlt className="w-5 h-5" />
            Explore Other Events
          </button>
        )
      };
    }

    return {
      containerClass: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl shadow-sm',
      icon: <FaCalendarAlt className="w-6 h-6 text-blue-600 dark:text-blue-300" />,
      title: 'Spots Available',
      message: `${currentEvent.availableSpots} spots remaining`,
      actionButton: (
        <button
          onClick={handleRegister}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-lg font-medium flex items-center justify-center gap-3"
        >
          <FaCalendarAlt className="w-5 h-5" />
          Register for Event
        </button>
      )
    };
  };

  const statusUI = getRegistrationStatusUI();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{currentEvent.title}</h1>
            <p className="text-xl text-blue-100 mb-8">
              {currentEvent.description.split('\n')[0]}
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleRegister}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FaCalendarAlt className="mr-2" />
                Register Now
              </button>
              <button 
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-6 py-3 border border-white rounded-md shadow-sm text-base font-medium text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
              >
                <FaCalendarAlt className="mr-2" />
                Explore More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Admin header - only shown to admins */}
          {isAdmin && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6">
              <h2 className="text-white text-xl font-medium flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5" />
                Admin Event View
              </h2>
            </div>
          )}
          
          <div className="p-8">
            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Overview</h2>
                    <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                      {currentEvent.description}
                    </div>
                  </div>
                  
                  {/* Event Features */}
                  <div className="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FaCalendarAlt className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Date</h4>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{new Date(currentEvent.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FaUsers className="w-6 h-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Capacity</h4>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{currentEvent.capacity}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FaMapMarkerAlt className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Location</h4>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{currentEvent.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <FaTicketAlt className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Available Spots</h4>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{currentEvent.availableSpots}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration Status */}
                  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${statusUI.containerClass}`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {statusUI.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{statusUI.title}</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{statusUI.message}</p>
                        {statusUI.subMessage && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{statusUI.subMessage}</p>
                        )}
                      </div>
                    </div>
                    {statusUI.actionButton}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Event Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <FaCalendarAlt className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Registration Opens</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{new Date(currentEvent.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <FaCheck className="w-5 h-5 text-green-600 dark:text-green-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Event Date</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">{new Date(currentEvent.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleRegister}
                      className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition duration-200 flex items-center justify-center gap-2"
                    >
                      <FaCalendarAlt className="w-5 h-5" />
                      Register
                    </button>
                    <button 
                      onClick={() => navigate('/events')}
                      className="w-full bg-gray-600 dark:bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition duration-200 flex items-center justify-center gap-2"
                    >
                      <FaCalendarAlt className="w-5 h-5" />
                      Back
                    </button>
                  </div>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Admin Controls</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link to={`/admin/events/${id}`} className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200">
                            Edit Event Details
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <FaUsers className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <Link to={`/admin/registrations?event=${id}`} className="text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200">
                            Manage Registrations
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;