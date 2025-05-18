import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEventContext from '../contexts/event/eventContext';
import useAuthContext from '../contexts/auth/authContext';
import EventForm from '../components/events/EventForm';
import EventManagement from '../components/admin/EventManagement';
import Spinner from '../components/layout/Spinner';
import { FaCalendarAlt, FaChartLine, FaUsers, FaClipboardList } from 'react-icons/fa';

const AdminEventsPage = () => {
  const { getEvents, events, loading } = useEventContext();
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    if (isInitialLoad) {
      getEvents().then(() => {
        setIsInitialLoad(false);
      });
    }
  }, [isAuthenticated, user, navigate, isInitialLoad, getEvents]);

  // Calculate dashboard stats
  const dashboardStats = {
    totalEvents: events?.length || 0,
    upcomingEvents: events?.filter(e => new Date(e.date) > new Date()).length || 0,
    pastEvents: events?.filter(e => new Date(e.date) <= new Date()).length || 0,
    totalCapacity: events?.reduce((acc, event) => acc + event.capacity, 0) || 0
  };

  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-center items-center pt-20">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-8 pb-16 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Event Management Dashboard</h1>
          <p className="text-blue-100 text-lg">
            {user?.name ? `Welcome back, ${user.name}` : 'Admin Portal'}
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <FaCalendarAlt className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardStats.totalEvents}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <FaChartLine className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardStats.upcomingEvents}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
              <FaClipboardList className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Past Events</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardStats.pastEvents}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center transform transition-transform hover:scale-105">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-3 mr-4">
              <FaUsers className="w-6 h-6 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardStats.totalCapacity}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8">
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl mb-8 p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </h2>
            <EventForm 
              event={editingEvent} 
              isEditing={!!editingEvent} 
              onComplete={() => {
                setShowAddForm(false);
                setEditingEvent(null);
              }} 
            />
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          {!showAddForm && <EventManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;