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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{currentEvent.title}</h1>
            <button
              onClick={() => navigate('/admin/events')}
              className="text-primary-600 hover:text-primary-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isRtl ? 'العودة إلى إدارة الفعاليات' : 'Back to Event Management'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{isRtl ? 'تفاصيل الحدث' : 'Event Details'}</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <p><span className="font-medium">Date:</span> {new Date(currentEvent.date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Location:</span> {currentEvent.location}</p>
                  <p><span className="font-medium">Available Spots:</span> {currentEvent.availableSpots}</p>
                </div>
              </div>
            </div>

            {/* Registration Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{isRtl ? 'إحصائيات التسجيل' : 'Registration Statistics'}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-100 rounded">
                  <p className="text-sm text-blue-800">Total</p>
                  <p className="text-xl font-bold text-blue-900">{registrationStats.total}</p>
                </div>
                <div className="text-center p-3 bg-yellow-100 rounded">
                  <p className="text-sm text-yellow-800">Pending</p>
                  <p className="text-xl font-bold text-yellow-900">{registrationStats.pending}</p>
                </div>
                <div className="text-center p-3 bg-green-100 rounded">
                  <p className="text-sm text-green-800">Approved</p>
                  <p className="text-xl font-bold text-green-900">{registrationStats.approved}</p>
                </div>
                <div className="text-center p-3 bg-red-100 rounded">
                  <p className="text-sm text-red-800">Rejected</p>
                  <p className="text-xl font-bold text-red-900">{registrationStats.rejected}</p>
                </div>
              </div>
            </div>
          </div>

          {error && <Alert type="error" message={error} className="mt-6" />}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">{isRtl ? 'قائمة التسجيلات' : 'Registration List'}</h3>
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
                          {registration.reason && registration.status === 'rejected' && (
                            <span className="ml-2 text-gray-500">({registration.reason})</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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