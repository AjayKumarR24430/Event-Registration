import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import { 
  FaSync, FaCalendarAlt, FaUsers, FaCheckCircle, FaTimesCircle, 
  FaClipboardList, FaClock, FaUserClock, FaExternalLinkAlt, 
  FaSearch, FaDownload, FaFilter
} from 'react-icons/fa';

const EventRegistrationsDashboard = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, getEvents, getEventById, loading: eventsLoading } = useEventContext();
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Initial data loading - separated into individual effects to prevent dependency cycles
  useEffect(() => {
    const loadInitialData = async () => {
      if (initialLoadComplete) return;
      
      setIsRefreshing(true);
      try {
        // First get events list
        await getEvents();
        // Then get admin registrations and stats
        await getAdminRegistrations();
        await getAdminStats();
        // Finally get event stats
        await getEventRegistrationStats();
        
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    loadInitialData();
  }, [getEvents, getAdminRegistrations, getAdminStats, getEventRegistrationStats, initialLoadComplete]);

  // Handle event selection from URL
  useEffect(() => {
    const selectEventFromUrl = async () => {
      if (!eventId || !initialLoadComplete) return;
      
      // First try to find the event in the loaded events list
      const eventFromList = events.find(e => e._id === eventId);
      
      if (eventFromList) {
        setSelectedEvent(eventFromList);
      } else {
        // If not found in list, fetch it directly
        try {
          const event = await getEventById(eventId);
          if (event) {
            setSelectedEvent(event);
          }
        } catch (error) {
          console.error('Event not found:', error);
        }
      }
    };
    
    selectEventFromUrl();
  }, [eventId, initialLoadComplete, events, getEventById]);

  // Load event registrations when an event is selected
  useEffect(() => {
    const loadEventRegistrations = async () => {
      if (!selectedEvent) return;
      
      try {
        await getEventRegistrations(selectedEvent._id);
      } catch (error) {
        console.error('Error loading event registrations:', error);
      }
    };
    
    loadEventRegistrations();
  }, [selectedEvent, getEventRegistrations]);

  // Update URL when event is selected but not from URL
  useEffect(() => {
    if (selectedEvent && !eventId) {
      navigate(`/admin/events/${selectedEvent._id}/registrations`, { replace: true });
    }
  }, [selectedEvent, navigate, eventId]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        getEvents(),
        getAdminRegistrations(),
        getAdminStats(),
        getEventRegistrationStats()
      ]);
      
      if (selectedEvent) {
        await getEventRegistrations(selectedEvent._id);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      await approveRegistration(registrationId);
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
        if (selectedEvent) {
          await getEventRegistrations(selectedEvent._id);
        }
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  };

  // Filter event registrations
  const filteredRegistrations = eventRegistrations?.filter(reg => {
    // Filter by status
    if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        reg.user?.username?.toLowerCase().includes(term) ||
        reg.user?.email?.toLowerCase().includes(term) ||
        reg.user?.name?.toLowerCase().includes(term)
      );
    }
    
    return true;
  }) || [];

  // Export registrations to CSV
  const exportRegistrations = () => {
    if (!eventRegistrations || eventRegistrations.length === 0) return;
    
    const headers = ['User', 'Email', 'Status', 'Registration Date', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        `"${(reg.user?.name || reg.user?.username || '').replace(/"/g, '""')}"`,
        `"${(reg.user?.email || '').replace(/"/g, '""')}"`,
        `"${reg.status}"`,
        `"${new Date(reg.createdAt).toLocaleDateString()}"`,
        `"${(reg.reason || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedEvent?.title.replace(/\s+/g, '_')}_registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (eventsLoading || registrationsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 pt-8 pb-16 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Event Registration Dashboard
          </h1>
          <p className="text-indigo-100 text-lg">
            Manage and track registrations across all events
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats?.registrations?.total || 0}
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
              <FaClock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats?.registrations?.pending || 0}
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats?.registrations?.approved || 0}
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mr-4">
              <FaTimesCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {adminStats?.registrations?.rejected || 0}
              </p>
            </div>
          </div>
        </div>

        {error && <Alert type="error" message={error} className="mb-6" />}

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Events Selection */}
          <div className="w-full md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Event Selection
                </h2>
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition"
                  title="Refresh Data"
                >
                  <FaSync className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {events.map(event => (
                  <div 
                    key={event._id}
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      selectedEvent?._id === event._id 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <FaCalendarAlt className="w-3.5 h-3.5 mr-1.5" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        new Date(event.date) > new Date() 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
                      }`}>
                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <div className="text-center p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-100 dark:border-yellow-800">
                        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">Pending</p>
                        <p className="font-bold text-yellow-900 dark:text-yellow-200">
                          {eventStats[event._id]?.pending || 0}
                        </p>
                      </div>
                      <div className="text-center p-1.5 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800">
                        <p className="text-xs font-medium text-green-800 dark:text-green-300">Approved</p>
                        <p className="font-bold text-green-900 dark:text-green-200">
                          {eventStats[event._id]?.approved || 0}
                        </p>
                      </div>
                      <div className="text-center p-1.5 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800">
                        <p className="text-xs font-medium text-red-800 dark:text-red-300">Rejected</p>
                        <p className="font-bold text-red-900 dark:text-red-200">
                          {eventStats[event._id]?.rejected || 0}
                        </p>
                      </div>
                      <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                        <p className="text-xs font-medium text-blue-800 dark:text-blue-300">Total</p>
                        <p className="font-bold text-blue-900 dark:text-blue-200">
                          {eventStats[event._id]?.total || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                    <p>No events found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Registration Details */}
          <div className="w-full md:w-2/3">
            {selectedEvent ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <FaUserClock className="w-5 h-5" />
                      Registrations for {selectedEvent.title}
                    </h3>
                    <Link 
                      to={`/events/${selectedEvent._id}`}
                      className="text-indigo-100 hover:text-white flex items-center gap-1.5 text-sm"
                    >
                      <span>View Event</span>
                      <FaExternalLinkAlt className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        className="py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      {eventRegistrations && eventRegistrations.length > 0 && (
                        <button
                          onClick={exportRegistrations}
                          className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                          title="Export to CSV"
                        >
                          <FaDownload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {filteredRegistrations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-800/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Registration Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredRegistrations.map(registration => (
                            <tr key={registration._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {registration.user?.name || registration.user?.username || '—'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {registration.user?.email || '—'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  registration.status === 'approved' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                    : registration.status === 'rejected' 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {registration.status === 'approved' && <FaCheckCircle className="w-3 h-3 mr-1" />}
                                  {registration.status === 'rejected' && <FaTimesCircle className="w-3 h-3 mr-1" />}
                                  {registration.status === 'pending' && <FaClock className="w-3 h-3 mr-1" />}
                                  {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                </div>
                                {registration.reason && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                    Reason: {registration.reason}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(registration.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                {registration.status === 'pending' ? (
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleApprove(registration._id)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                                    >
                                      <FaCheckCircle className="w-3 h-3 mr-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleReject(registration._id)}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                                    >
                                      <FaTimesCircle className="w-3 h-3 mr-1" />
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                    {registration.status === 'approved' ? 'Approved' : 'Rejected'}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FaClipboardList className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No registrations found</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        {searchTerm || statusFilter !== 'all'
                          ? 'No registrations match your search criteria. Try adjusting your filters.'
                          : 'This event has no registrations yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                <FaCalendarAlt className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Select an event
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Choose an event from the list to view and manage its registrations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsDashboard; 