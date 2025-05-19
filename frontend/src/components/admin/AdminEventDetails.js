import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import RejectRegistrationModal from '../modals/RejectRegistrationModal';

const AdminEventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEvent, currentEvent, loading: eventLoading } = useEventContext();
  const {
    getEventRegistrations,
    eventRegistrations,
    approveRegistration,
    rejectRegistration,
    loading: registrationsLoading,
    error
  } = useRegistrationContext();
  const { isRtl } = useRtlContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const loadEventData = useCallback(async () => {
    try {
      setLoadError(null);
      const event = await getEvent(eventId);
      if (!event) {
        setLoadError('Event not found');
        return;
      }
      await getEventRegistrations(eventId);
    } catch (error) {
      console.error('Error loading event data:', error);
      setLoadError(error.message || 'Failed to load event data');
    }
  }, [eventId, getEvent, getEventRegistrations]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleApprove = async (registrationId) => {
    try {
      setIsRefreshing(true);
      await approveRegistration(registrationId);
      await getEventRegistrations(eventId);
    } catch (error) {
      console.error('Error approving registration:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReject = (registration) => {
    setSelectedRegistration(registration);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason) => {
    if (!selectedRegistration) return;
    
    try {
      setIsRefreshing(true);
      await rejectRegistration(selectedRegistration._id, reason);
      await getEventRegistrations(eventId);
    } catch (error) {
      console.error('Error rejecting registration:', error);
    } finally {
      setIsRefreshing(false);
      setRejectModalOpen(false);
      setSelectedRegistration(null);
    }
  };

  if (loadError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message={loadError} />
        <button
          onClick={() => navigate('/admin/events')}
          className="mt-4 text-primary-600 hover:text-primary-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {isRtl ? 'العودة إلى إدارة الفعاليات' : 'Back to Event Management'}
        </button>
      </div>
    );
  }

  if (eventLoading || registrationsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (!currentEvent) {
    return null;
  }

  const registrationStats = {
    total: eventRegistrations.length,
    pending: eventRegistrations.filter(reg => reg.status === 'pending').length,
    approved: eventRegistrations.filter(reg => reg.status === 'approved').length,
    rejected: eventRegistrations.filter(reg => reg.status === 'rejected').length
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{currentEvent.title}</h1>
              <p className="text-sm text-gray-500">{currentEvent.description}</p>
            </div>
            <button
              onClick={() => navigate('/admin/events')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isRtl ? 'العودة إلى إدارة الفعاليات' : 'Back to Event Management'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Event Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{isRtl ? 'تفاصيل الحدث' : 'Event Details'}</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{new Date(currentEvent.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Event Date</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{currentEvent.location}</p>
                    <p className="text-xs text-gray-500">Location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{currentEvent.availableSpots}</p>
                    <p className="text-xs text-gray-500">Available Spots</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Stats */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{isRtl ? 'إحصائيات التسجيل' : 'Registration Statistics'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{registrationStats.total}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{registrationStats.pending}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Approved</p>
                      <p className="text-2xl font-bold text-gray-900">{registrationStats.approved}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rejected</p>
                      <p className="text-2xl font-bold text-gray-900">{registrationStats.rejected}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && <Alert type="error" message={error} className="mt-6" />}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">{isRtl ? 'قائمة التسجيلات' : 'Registration List'}</h3>
            <div className="overflow-x-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
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
                    <tbody className="divide-y divide-gray-200">
                      {eventRegistrations.map(registration => (
                        <tr key={registration._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={registration.user?.avatar || 'https://via.placeholder.com/40'} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {registration.user?.username || registration.user?.email || 'Unknown User'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {registration.user?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              registration.status === 'approved' ? 'bg-green-100 text-green-800' :
                              registration.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                              {registration.reason && registration.status === 'rejected' && (
                                <span className="ml-2 text-gray-500">({registration.reason})</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(registration.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {registration.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(registration._id)}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(registration)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RejectRegistrationModal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedRegistration(null);
        }}
        onConfirm={handleRejectConfirm}
        isRtl={isRtl}
      />
    </div>
  );
};

export default AdminEventDetails; 