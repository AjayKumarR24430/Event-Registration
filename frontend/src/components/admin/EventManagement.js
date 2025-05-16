import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import SearchEvents from '../events/SearchEvents';
import EventForm from '../events/EventForm';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';

const EventManagement = () => {
  const eventContext = useEventContext();
  const rtlContext = useRtlContext();
  
  const { events, getEvents, deleteEvent, loading, error, filtered } = eventContext;
  const { isRtl } = rtlContext;
  
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  useEffect(() => {
    getEvents();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: error });
    }
    // eslint-disable-next-line
  }, [error]);
  
  // Add debug logs
  useEffect(() => {
    if (filtered || events) {
      console.log('Events data:', filtered || events);
    }
  }, [filtered, events]);
  
  const handleDeleteClick = (event) => {
    console.log('Delete clicked for event:', event);
    setEventToDelete(event);
    setShowDeleteModal(true);
  };
  
  const handleEditClick = (event) => {
    console.log('Edit clicked for event:', event);
    setEditingEvent(event);
    setShowAddForm(true);
  };
  
  const confirmDelete = () => {
    deleteEvent(eventToDelete._id);
    setShowDeleteModal(false);
    setAlert({ type: 'success', message: `Event "${eventToDelete.title}" deleted successfully` });
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', options);
  };
  
  const handleFormComplete = () => {
    setShowAddForm(false);
    setEditingEvent(null);
    getEvents(); // Refresh the list
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  const displayEvents = filtered || events;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isRtl ? 'إدارة الفعاليات' : 'Event Management'}
        </h1>
        
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowAddForm(true);
          }}
          className="mt-4 md:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-200 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {isRtl ? 'إضافة فعالية' : 'Add Event'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'Add Event'}
          </h2>
          <EventForm 
            event={editingEvent} 
            isEditing={!!editingEvent} 
            onComplete={handleFormComplete}
          />
        </div>
      )}
      
      <div className="mb-6">
        <SearchEvents />
      </div>
      
      {alert && <Alert type={alert.type} message={alert.message} className="mb-6" />}
      
      {displayEvents && displayEvents.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4">{isRtl ? 'العنوان' : 'Title'}</th>
                  <th className="py-3 px-4">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3 px-4">{isRtl ? 'الموقع' : 'Location'}</th>
                  <th className="py-3 px-4">{isRtl ? 'المقاعد المتاحة' : 'Available'}</th>
                  <th className="py-3 px-4">{isRtl ? 'السعة' : 'Capacity'}</th>
                  <th className="py-3 px-4">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {displayEvents.map(event => (
                  <tr key={event._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link to={`/admin/events/${event._id}`} className="text-primary-600 hover:underline font-medium">
                        {event.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{formatDate(event.date)}</td>
                    <td className="py-3 px-4 text-gray-700">{event.location}</td>
                    <td className="py-3 px-4 text-gray-700">{event.availableSpots}</td>
                    <td className="py-3 px-4 text-gray-700">{event.capacity}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>{isRtl ? 'تحرير' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>{isRtl ? 'حذف' : 'Delete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">
            {isRtl ? 'لا توجد فعاليات لعرضها' : 'No events to display'}
          </p>
          <p className="mt-2">
            {isRtl 
              ? 'أنشئ فعالية جديدة لبدء استقبال التسجيلات' 
              : 'Create a new event to start accepting registrations'}
          </p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {isRtl ? 'تأكيد الحذف' : 'Confirm Delete'}
            </h2>
            <p className="mb-6">
              {isRtl 
                ? `هل أنت متأكد من رغبتك في حذف الحدث "${eventToDelete.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete the event "${eventToDelete.title}"? This action cannot be undone.`}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
              >
                {isRtl ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;