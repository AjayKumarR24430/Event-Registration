import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import SearchEvents from '../events/SearchEvents';
import EventForm from '../events/EventForm';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import { 
  FaPlus, FaEdit, FaTrashAlt, FaCalendarAlt, FaMapMarkerAlt, 
  FaUsers, FaSort, FaFilter, FaTimes, FaCheck
} from 'react-icons/fa';

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
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort events
  const sortEvents = (eventsToSort) => {
    if (!eventsToSort) return [];
    
    return [...eventsToSort].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'location':
          comparison = a.location.localeCompare(b.location);
          break;
        case 'availableSpots':
          comparison = a.availableSpots - b.availableSpots;
          break;
        case 'capacity':
          comparison = a.capacity - b.capacity;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  const displayEvents = sortEvents(filtered || events);
  const hasEvents = displayEvents && displayEvents.length > 0;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
          {isRtl ? 'إدارة الفعاليات' : 'Event Management'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {isRtl 
            ? 'إدارة وتنظيم الفعاليات القادمة' 
            : 'Manage and organize upcoming events'}
        </p>
      </div>
      
      {/* Action Bar */}
      <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
        <SearchEvents />
        
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowAddForm(true);
          }}
          className="btn btn-primary flex items-center justify-center gap-2 py-2.5"
        >
          <FaPlus className="w-4 h-4" />
          <span>{isRtl ? 'إضافة فعالية جديدة' : 'Add New Event'}</span>
        </button>
      </div>
      
      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <EventForm 
                event={editingEvent} 
                isEditing={!!editingEvent} 
                onComplete={handleFormComplete}
              />
            </div>
          </div>
        </div>
      )}
      
      {alert && <Alert type={alert.type} message={alert.message} className="mb-6" />}
      
      {/* Events Table */}
      {hasEvents ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-2">
                      <span>{isRtl ? 'العنوان' : 'Title'}</span>
                      {sortField === 'title' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2">
                      <span>{isRtl ? 'التاريخ' : 'Date'}</span>
                      {sortField === 'date' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('location')}>
                    <div className="flex items-center gap-2">
                      <span>{isRtl ? 'الموقع' : 'Location'}</span>
                      {sortField === 'location' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('availableSpots')}>
                    <div className="flex items-center gap-2">
                      <span>{isRtl ? 'المقاعد المتاحة' : 'Available'}</span>
                      {sortField === 'availableSpots' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('capacity')}>
                    <div className="flex items-center gap-2">
                      <span>{isRtl ? 'السعة' : 'Capacity'}</span>
                      {sortField === 'capacity' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {isRtl ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {displayEvents.map(event => (
                  <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/admin/events/${event._id}`} 
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      >
                        {event.title}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.category}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${event.availableSpots > 10 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : event.availableSpots > 0 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {event.availableSpots}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUsers className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{event.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="btn btn-outline-primary p-2 flex items-center gap-2"
                          title={isRtl ? 'تحرير' : 'Edit'}
                        >
                          <FaEdit className="w-4 h-4" />
                          <span className="sr-only md:not-sr-only">{isRtl ? 'تحرير' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="btn btn-outline-danger p-2 flex items-center gap-2"
                          title={isRtl ? 'حذف' : 'Delete'}
                        >
                          <FaTrashAlt className="w-4 h-4" />
                          <span className="sr-only md:not-sr-only">{isRtl ? 'حذف' : 'Delete'}</span>
                        </button>
                        <Link
                          to={`/admin/events/${event._id}/registrations`}
                          className="btn btn-outline-info p-2 flex items-center gap-2"
                          title={isRtl ? 'التسجيلات' : 'Registrations'}
                        >
                          <FaUsers className="w-4 h-4" />
                          <span className="sr-only md:not-sr-only">{isRtl ? 'التسجيلات' : 'Registrations'}</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <FaCalendarAlt className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isRtl ? 'لا توجد فعاليات' : 'No Events Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {isRtl 
              ? 'لم يتم العثور على أي فعاليات. أضف فعالية جديدة لبدء استقبال الطلبات.' 
              : 'No events were found. Add a new event to start receiving registrations.'}
          </p>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowAddForm(true);
            }}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <FaPlus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة فعالية جديدة' : 'Add New Event'}</span>
          </button>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isRtl ? 'تأكيد الحذف' : 'Confirm Deletion'}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {isRtl 
                  ? `هل أنت متأكد من رغبتك في حذف الفعالية "${eventToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-outline px-4 py-2 flex items-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  <span>{isRtl ? 'إلغاء' : 'Cancel'}</span>
                </button>
                <button
                  onClick={confirmDelete}
                  className="btn btn-danger px-4 py-2 flex items-center gap-2"
                >
                  <FaTrashAlt className="w-4 h-4" />
                  <span>{isRtl ? 'حذف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;