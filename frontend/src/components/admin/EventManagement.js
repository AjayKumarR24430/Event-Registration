import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import SearchEvents from '../events/SearchEvents';
import EventForm from '../events/EventForm';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import { 
  FaPlus, FaEdit, FaTrashAlt, FaCalendarAlt, FaMapMarkerAlt, 
  FaUsers, FaSort, FaFilter, FaTimes, FaCheck, FaEye,
  FaCalendarCheck, FaCalendarTimes, FaClock, FaAngleDown, 
  FaDownload, FaChartBar, FaListUl, FaTable
} from 'react-icons/fa';

const EventManagement = () => {
  const { events, getEvents, deleteEvent, loading, error, filtered } = useEventContext();
  const { isRtl } = useRtlContext();
  
  const [alert, setAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
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
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };
  
  const handleEditClick = (event) => {
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
  
  // Get unique categories from events
  const getCategories = () => {
    const categoriesSet = new Set();
    if (events) {
      events.forEach(event => {
        if (event.category) {
          categoriesSet.add(event.category);
        }
      });
    }
    return ['all', ...Array.from(categoriesSet)];
  };
  
  // Calculate event stats
  const getEventStats = () => {
    if (!events) return { upcoming: 0, past: 0, total: 0 };
    
    const now = new Date();
    const upcoming = events.filter(event => new Date(event.date) > now).length;
    const past = events.filter(event => new Date(event.date) <= now).length;
    
    return {
      upcoming,
      past,
      total: events.length
    };
  };
  
  // Filter events by category
  const filterEventsByCategory = (eventsToFilter) => {
    if (selectedCategory === 'all' || !eventsToFilter) return eventsToFilter;
    
    return eventsToFilter.filter(event => 
      event.category && event.category.toLowerCase() === selectedCategory.toLowerCase()
    );
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
  
  const eventStats = getEventStats();
  const categories = getCategories();
  
  if (loading) {
    return <Spinner />;
  }
  
  // Apply filters and sorting
  const filteredByCategory = filterEventsByCategory(filtered || events);
  const displayEvents = sortEvents(filteredByCategory);
  const hasEvents = displayEvents && displayEvents.length > 0;
  
  // Export events to CSV
  const exportEvents = () => {
    if (!displayEvents || displayEvents.length === 0) return;
    
    // Create CSV content
    const headers = ['Title', 'Date', 'Location', 'Category', 'Capacity', 'Available Spots'];
    const csvContent = [
      headers.join(','),
      ...displayEvents.map(event => [
        `"${event.title.replace(/"/g, '""')}"`, 
        `"${new Date(event.date).toLocaleDateString()}"`,
        `"${event.location.replace(/"/g, '""')}"`,
        `"${event.category || ''}"`,
        event.capacity,
        event.availableSpots
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'events.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="overflow-hidden">
      {/* Quick Statistics */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FaCalendarCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Events</p>
            <p className="text-xl font-semibold">{eventStats.upcoming}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <FaCalendarTimes className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Past Events</p>
            <p className="text-xl font-semibold">{eventStats.past}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <FaCalendarAlt className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
            <p className="text-xl font-semibold">{eventStats.total}</p>
          </div>
        </div>
      </div>
      
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mr-4">
            Events
            <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              ({displayEvents?.length || 0})
            </span>
          </h2>
          
          <div className="hidden md:flex gap-2">
            <button 
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <FaTable className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaChartBar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="w-full md:w-auto relative" ref={dropdownRef}>
            <button 
              className="flex items-center justify-between w-full md:w-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <div className="flex items-center gap-2">
                <FaFilter className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                <span>{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              </div>
              <FaAngleDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedCategory === category ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <SearchEvents className="w-full md:w-auto" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={exportEvents}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
              disabled={!hasEvents}
              title="Export Events"
            >
              <FaDownload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export</span>
            </button>
            
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowAddForm(true);
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <FaPlus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {alert && <Alert type={alert.type} message={alert.message} className="m-6" />}
      
      {/* Events List */}
      {hasEvents ? (
        viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-2">
                      <span>Title</span>
                      {sortField === 'title' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-2">
                      <span>Date</span>
                      {sortField === 'date' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('location')}>
                    <div className="flex items-center gap-2">
                      <span>Location</span>
                      {sortField === 'location' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('availableSpots')}>
                    <div className="flex items-center gap-2">
                      <span>Available</span>
                      {sortField === 'availableSpots' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => handleSort('capacity')}>
                    <div className="flex items-center gap-2">
                      <span>Capacity</span>
                      {sortField === 'capacity' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {displayEvents.map(event => (
                  <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <td className="px-6 py-4">
                      <Link 
                        to={`/admin/events/${event._id}`} 
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                      >
                        {event.title}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          new Date(event.date) > new Date() ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                          event.availableSpots === 0 
                            ? 'bg-red-500' 
                            : event.availableSpots < event.capacity * 0.2 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}></div>
                        <span>{event.availableSpots}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUsers className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{event.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Link 
                          to={`/events/${event._id}`}
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" 
                          title="View Event"
                        >
                          <FaEye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleEditClick(event)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300" 
                          title="Edit Event"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(event)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Event"
                        >
                          <FaTrashAlt className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {displayEvents.map(event => (
              <div key={event._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      new Date(event.date) > new Date() 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
                    }`}>
                      {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FaUsers className="w-4 h-4 mr-2" />
                      <span>{event.availableSpots} / {event.capacity} spots available</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          event.availableSpots === 0 
                            ? 'bg-red-500' 
                            : event.availableSpots < event.capacity * 0.2 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, (event.availableSpots / event.capacity) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link 
                      to={`/events/${event._id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center" 
                    >
                      <FaEye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Link>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(event)}
                        className="p-1.5 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" 
                        title="Edit Event"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(event)}
                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete Event"
                      >
                        <FaTrashAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            There are no events available matching your criteria. Try creating a new event or adjusting your search filters.
          </p>
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowAddForm(true);
            }}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <FaPlus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventManagement;