import React, { useEffect, useState } from 'react';
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
  
  useEffect(() => {
    getEvents();
    getPendingRegistrations();
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (events && !eventsLoading) {
      const now = new Date();
      const upcoming = events.filter(event => new Date(event.date) > now).length;
      const totalCapacity = events.reduce((acc, event) => acc + (event.capacity || 0), 0);
      const totalRegistered = events.reduce((acc, event) => 
        acc + ((event.capacity || 0) - (event.availableSpots || 0)), 0);
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        pendingRegistrations: pendingRegistrations ? pendingRegistrations.length : 0,
        totalCapacity,
        totalRegistered
      });
    }
  }, [events, pendingRegistrations, eventsLoading]);
  
  if (eventsLoading || registrationsLoading) {
    return <Spinner />;
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {(eventError || registrationError) && (
        <Alert 
          type="error" 
          message={eventError || registrationError} 
        />
      )}
      
      <h1 className="text-2xl font-bold mb-8">
        {isRtl ? 'لوحة التحكم' : 'Admin Dashboard'}
      </h1>
      
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
              ? `${Math.round((stats.totalRegistered / stats.totalCapacity) * 100)}%`
              : '0%'
            }
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
              {isRtl ? 'الأحداث القادمة' : 'Upcoming Events'}
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
                      <th className="py-2 px-3 text-left">{isRtl ? 'الحدث' : 'Event'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'التاريخ' : 'Date'}</th>
                      <th className="py-2 px-3 text-left">{isRtl ? 'المقاعد المتاحة' : 'Available'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter(event => new Date(event.date) > new Date())
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 5)
                      .map(event => (
                        <tr key={event._id} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <Link to={`/events/${event._id}`} className="text-primary-600 hover:underline">
                              {event.title}
                            </Link>
                          </td>
                          <td className="py-2 px-3">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-3">
                            {event.availableSpots} / {event.capacity}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {isRtl ? 'لا توجد أحداث قادمة' : 'No upcoming events'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;