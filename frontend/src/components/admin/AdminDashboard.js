import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useEventContext from '../../contexts/event/eventContext';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';

const AdminDashboard = () => {
  const eventContext = useEventContext();
  const registrationContext = useRegistrationContext();
  const rtlContext = useRtlContext();
  
  const { events, loading: eventsLoading, getEvents, error: eventError } = eventContext;
  const { 
    pendingRegistrations, 
    getPendingRegistrations,
    getAdminStats,
    stats: registrationStats,
    loading: registrationsLoading,
    error: registrationError 
  } = registrationContext;
  const { isRtl } = rtlContext;
  
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    pendingRegistrations: 0,
    totalCapacity: 0,
    totalRegistered: 0
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        getEvents(),
        getPendingRegistrations(),
        getAdminStats()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [getEvents, getPendingRegistrations, getAdminStats]);
  
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  useEffect(() => {
    if (events && !eventsLoading && registrationStats) {
      const now = new Date();
      const upcoming = events.filter(event => new Date(event.date) > now).length;
      const totalCapacity = events.reduce((acc, event) => acc + (event.capacity || 0), 0);
      const totalRegistered = registrationStats?.registrations?.total || 0;
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        pendingRegistrations: registrationStats?.registrations?.pending || 0,
        totalCapacity,
        totalRegistered
      });
    }
  }, [events, eventsLoading, registrationStats]);
  
  if (eventsLoading || registrationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">
            {isRtl ? 'جارٍ تحميل البيانات...' : 'Loading dashboard data...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {isRtl ? 'لوحة التحكم' : 'Admin Dashboard'}
        </h1>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className={`bg-primary-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
          }`}
        >
          {isRefreshing ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              {isRtl ? 'جارٍ التحديث...' : 'Refreshing...'}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRtl ? 'تحديث البيانات' : 'Refresh Data'}
            </>
          )}
        </button>
      </div>

      {(eventError || registrationError) && (
        <Alert 
          type="error" 
          message={eventError || registrationError} 
          className="mb-6"
        />
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isRtl ? 'إجمالي الفعاليات' : 'Total Events'}
          </h3>
          <p className="text-3xl font-bold text-primary-600">{stats.totalEvents}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isRtl ? 'الفعاليات القادمة' : 'Upcoming Events'}
          </h3>
          <p className="text-3xl font-bold text-green-600">{stats.upcomingEvents}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isRtl ? 'التسجيلات المعلقة' : 'Pending Registrations'}
          </h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingRegistrations}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isRtl ? 'نسبة الإشغال' : 'Occupancy Rate'}
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalCapacity > 0
              ? Math.round((stats.totalRegistered / stats.totalCapacity) * 100)
              : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.totalRegistered} / {stats.totalCapacity}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isRtl ? 'التسجيلات المعلقة' : 'Pending Registrations'}
            </h2>
            <Link 
              to="/admin/registrations" 
              className="text-sm text-primary-600 hover:underline"
            >
              {isRtl ? 'عرض الكل' : 'View All'}
            </Link>
          </div>
          
          {pendingRegistrations && pendingRegistrations.length > 0 ? (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left">{isRtl ? 'الحدث' : 'Event'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'المستخدم' : 'User'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'التاريخ' : 'Date'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRegistrations.slice(0, 5).map(reg => (
                      <tr key={reg._id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <Link to={`/events/${reg.event._id}`} className="text-primary-600 hover:underline">
                            {reg.event.title || 'Loading...'}
                          </Link>
                        </td>
                        <td className="py-2 px-3">
                          {reg.user ? (reg.user.username || reg.user.email) : 'Unknown User'}
                        </td>
                        <td className="py-2 px-3">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-3">
                          <Link 
                            to="/admin/registrations" 
                            className="text-primary-600 hover:underline text-sm"
                          >
                            {isRtl ? 'إدارة' : 'Manage'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {isRtl ? 'لا توجد تسجيلات معلقة' : 'No pending registrations'}
            </p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isRtl ? 'الفعاليات' : 'Events'}
            </h2>
            <Link 
              to="/admin/events" 
              className="text-sm text-primary-600 hover:underline"
            >
              {isRtl ? 'عرض الكل' : 'View All'}
            </Link>
          </div>
          
          {events && events.length > 0 ? (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left">{isRtl ? 'الفعالية' : 'Event'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'التاريخ' : 'Date'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'الحالة' : 'Status'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'التسجيلات' : 'Registrations'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 5)
                      .map(event => {
                        const now = new Date();
                        const eventDate = new Date(event.date);
                        const status = eventDate < now ? 'Past' : 'Upcoming';
                        const registrationCount = event.capacity - (event.availableSpots || 0);
                        
                        return (
                          <tr key={event._id} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-3">
                              <Link to={`/admin/events/${event._id}`} className="text-primary-600 hover:underline">
                                {event.title}
                              </Link>
                            </td>
                            <td className="py-2 px-3">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="py-2 px-3">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                status === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              {registrationCount} / {event.capacity}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {isRtl ? 'لا توجد فعاليات' : 'No events available'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;