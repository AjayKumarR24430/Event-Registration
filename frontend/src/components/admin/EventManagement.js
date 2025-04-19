import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventContext } from '../../contexts/event/eventContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';
import SearchEvents from '../events/SearchEvents';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';

const EventManagement = () => {
  const eventContext = useContext(EventContext);
  const rtlContext = useContext(RtlContext);
  
  const { events, getEvents, deleteEvent, loading, error, filtered } = eventContext;
  const { isRtl } = rtlContext;
  
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  
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
  
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
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
  
  if (loading) {
    return <Spinner />;
  }
  
  const displayEvents = filtered || events;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {isRtl ? 'إدارة الأحداث' : 'Event Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isRtl 
              ? 'إنشاء وتحرير وحذف الأحداث'
              : 'Create, edit, and delete events'}
          </p>
        </div>
        
        <Link
          to="/admin/events/new"
          className="mt-4 md:mt-0 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-200"
        >
          {isRtl ? 'إنشاء حدث جديد' : 'Create New Event'}
        </Link>
      </div>
      
      <SearchEvents />
      
      {alert && <Alert type={alert.type} message={alert.message} />}
      
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
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {displayEvents.map(event => (
                  <tr key={event._id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link to={`/events/${event._id}`} className="text-primary-600 hover:underline font-medium">
                        {event.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{formatDate(event.date)}</td>
                    <td className="py-3 px-4 text-gray-700">{event.location}</td>
                    <td className="py-3 px-4 text-gray-700">{event.availableSpots}</td>
                    <td className="py-3 px-4 text-gray-700">{event.capacity}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex space-x-2 justify-end">
                        <Link
                          to={`/admin/events/edit/${event._id}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition duration-200"
                        >
                          {isRtl ? 'تحرير' : 'Edit'}
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
                        >
                          {isRtl ? 'حذف' : 'Delete'}
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
            {isRtl ? 'لا توجد أحداث لعرضها' : 'No events to display'}
          </p>
          <p className="mt-2">
            {isRtl 
              ? 'أنشئ حدثًا جديدًا لبدء استقبال التسجيلات' 
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