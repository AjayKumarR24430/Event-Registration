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
    getEventRegistrations,
    getEventRegistrationStats,
    getAdminStats,
    eventRegistrations,
    eventStats,
    stats: adminStats,
    approveRegistration,
    rejectRegistration,
    loading: registrationsLoading,
    error 
  } = useRegistrationContext();
  const { isRtl } = useRtlContext();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        getEvents(),
        getAdminRegistrations(),
        getAdminStats(),
        getEventRegistrationStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [getEvents, getAdminRegistrations, getAdminStats, getEventRegistrationStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedEvent) {
      getEventRegistrations(selectedEvent._id);
    }
  }, [selectedEvent, getEventRegistrations]);

  const handleApprove = async (registrationId) => {
    try {
      await approveRegistration(registrationId);
      await loadData();
      if (selectedEvent) {
        await getEventRegistrations(selectedEvent._id);
      }
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
        if (selectedEvent) {
          await getEventRegistrations(selectedEvent._id);
        }
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  if (eventsLoading || registrationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
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
              {isRtl ? 'جارٍ التحديث...' : 'Refreshing...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRtl ? 'تحديث' : 'Refresh'}
            </>
          )}
        </button>
      </div>

      {error && <Alert type="error" message={error} className="mb-6" />}

      {/* Overall Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {isRtl ? 'إحصائيات عامة' : 'Overall Statistics'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">Total Registrations</p>
            <p className="text-2xl font-bold text-blue-900">
              {adminStats?.registrations?.total || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {adminStats?.registrations?.pending || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <p className="text-sm text-green-800">Approved</p>
            <p className="text-2xl font-bold text-green-900">
              {adminStats?.registrations?.approved || 0}
            </p>
          </div>
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-800">Rejected</p>
            <p className="text-2xl font-bold text-red-900">
              {adminStats?.registrations?.rejected || 0}
            </p>
          </div>
        </div>
      </div>

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
              {selectedEvent.title} - {isRtl ? 'التسجيلات' : 'Registrations'}
            </h3>
            <Link 
              to={`/events/${selectedEvent._id}`}
              className="text-primary-600 hover:text-primary-700"
            >
              {isRtl ? 'عرض تفاصيل الفعالية' : 'View Event Details'}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isRtl ? 'المستخدم' : 'User'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isRtl ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isRtl ? 'تاريخ التسجيل' : 'Registration Date'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isRtl ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eventRegistrations.map(registration => (
                  <tr key={registration._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.user?.username || registration.user?.email || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.user?.email}
                      </div>
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
                      {registration.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(registration._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
                          >
                            {isRtl ? 'موافقة' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(registration._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
                          >
                            {isRtl ? 'رفض' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">
                          {registration.status === 'approved' ? 'Approved' : 'Rejected'} 
                          {registration.reason ? ` - ${registration.reason}` : ''}
                        </span>
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