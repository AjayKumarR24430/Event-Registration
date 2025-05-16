import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';

const EventRegistrationsDashboard = () => {
  const { events, getEvents, loading: eventsLoading } = useEventContext();
  const { 
    adminRegistrations, 
    getAdminRegistrations, 
    approveRegistration,
    rejectRegistration,
    loading: registrationsLoading,
    error 
  } = useRegistrationContext();
  const { isRtl } = useRtlContext();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStats, setEventStats] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        getEvents(),
        getAdminRegistrations()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [getEvents, getAdminRegistrations]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (events && adminRegistrations) {
      const stats = {};
      events.forEach(event => {
        const eventRegistrations = adminRegistrations.filter(reg => {
          const regEventId = typeof reg.event === 'object' ? reg.event._id : reg.event;
          return regEventId === event._id;
        });
        
        const total = eventRegistrations.length;
        const pending = eventRegistrations.filter(reg => reg.status === 'pending').length;
        const approved = eventRegistrations.filter(reg => reg.status === 'approved').length;
        const rejected = eventRegistrations.filter(reg => reg.status === 'rejected').length;
        
        stats[event._id] = {
          total,
          pending,
          approved,
          rejected,
          registrations: eventRegistrations
        };
      });
      setEventStats(stats);
    }
  }, [events, adminRegistrations]);

  const handleApprove = async (registrationId) => {
    try {
      await approveRegistration(registrationId);
      await loadData();
    } catch (error) {
      console.error('Error approving registration:', error);
    }
  };

  const handleReject = async (registrationId) => {
    try {
      const reason = window.prompt('Please provide a reason for rejection:');
      if (reason !== null) {
        await rejectRegistration(registrationId, reason);
        await loadData();
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  const getFilteredRegistrations = () => {
    if (!selectedEvent) return [];
    return eventStats[selectedEvent._id]?.registrations || [];
  };

  if (eventsLoading || registrationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Loading registration data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isRtl ? 'إدارة التسجيلات حسب الفعالية' : 'Event Registration Management'}
        </h2>
        <button
          onClick={loadData}
          disabled={isRefreshing}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
        >
          {isRefreshing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Refreshing...
            </>
          ) : (
            'Refresh Data'
          )}
        </button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {events.map(event => (
          <div 
            key={event._id}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 ${
              selectedEvent?._id === event._id ? 'ring-2 ring-primary-500' : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedEvent(event)}
          >
            <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
            <p className="text-gray-600 mb-4">
              {new Date(event.date).toLocaleDateString()}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-yellow-100 rounded">
                <p className="text-sm text-yellow-800">Pending</p>
                <p className="text-xl font-bold text-yellow-900">
                  {eventStats[event._id]?.pending || 0}
                </p>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <p className="text-sm text-green-800">Approved</p>
                <p className="text-xl font-bold text-green-900">
                  {eventStats[event._id]?.approved || 0}
                </p>
              </div>
              <div className="text-center p-2 bg-red-100 rounded">
                <p className="text-sm text-red-800">Rejected</p>
                <p className="text-xl font-bold text-red-900">
                  {eventStats[event._id]?.rejected || 0}
                </p>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded">
                <p className="text-sm text-blue-800">Total</p>
                <p className="text-xl font-bold text-blue-900">
                  {eventStats[event._id]?.total || 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">
              {selectedEvent.title} - Registrations
            </h3>
            <Link 
              to={`/events/${selectedEvent._id}`}
              className="text-primary-600 hover:text-primary-700"
            >
              View Event Details
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredRegistrations().map(registration => (
                  <tr key={registration._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.user?.username || registration.user?.email || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                        registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(registration.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {registration.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(registration._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(registration._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationsDashboard; 