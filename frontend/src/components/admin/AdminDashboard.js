import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventContext } from '../../contexts/event/eventContext';
import { RegistrationContext } from '../../contexts/registration/registrationContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';

const AdminDashboard = () => {
  const eventContext = useContext(EventContext);
  const registrationContext = useContext(RegistrationContext);
  const rtlContext = useContext(RtlContext);
  
  const { events, loading: eventsLoading, getEvents } = eventContext;
  const { 
    pendingRegistrations, 
    getPendingRegistrations, 
    loading: registrationsLoading 
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
      const totalCapacity = events.reduce((acc, event) => acc + event.capacity, 0);
      const totalRegistered = events.reduce((acc, event) => acc + (event.capacity - event.availableSpots), 0);
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        pendingRegistrations: pendingRegistrations ? pendingRegistrations.length : 0,
        totalCapacity,
        totalRegistered
      });
    }
  }, [events, pendingRegistrations, eventsLoading, registrationsLoading]);
  
  if (eventsLoading || registrationsLoading) {
    return <Spinner />;
  }
  
  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">
          {isRtl ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800">
              {isRtl ? 'إجمالي الأحداث' : 'Total Events'}
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalEvents}</p>
            <Link 
              to="/admin/events" 
              className="text-blue-600 text-sm hover:underline mt-2 inline-block"
            >
              {isRtl ? 'إدارة الأحداث' : 'Manage Events'}
            </Link>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h2 className="text-lg font-semibold text-green-800">
              {isRtl ? 'الأحداث القادمة' : 'Upcoming Events'}
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.upcomingEvents}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h2 className="text-lg font-semibold text-yellow-800">
              {isRtl ? 'التسجيلات المعلقة' : 'Pending Registrations'}
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.pendingRegistrations}</p>
            <Link 
              to="/admin/registrations" 
              className="text-yellow-600 text-sm hover:underline mt-2 inline-block"
            >
              {isRtl ? 'إدارة التسجيلات' : 'Manage Registrations'}
            </Link>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h2 className="text-lg font-semibold text-purple-800">
              {isRtl ? 'إجمالي السعة' : 'Total Capacity'}
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalCapacity}</p>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <h2 className="text-lg font-semibold text-pink-800">
              {isRtl ? 'إجمالي المسجلين' : 'Total Registered'}
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalRegistered}</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h2 className="text-lg font-semibold text-indigo-800">
              {isRtl ? 'معدل الإشغال' : 'Occupancy Rate'}
            </h2>
            <p className="text-3xl font-bold mt-2">
              {stats.totalCapacity > 0 
                ? `${Math.round((stats.totalRegistered / stats.totalCapacity) * 100)}%` 
                : '0%'}
            </p>
          </div>
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
                          {reg.event.title || 'Loading...'}
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
      
      <div className="mt-6 flex justify-center">
        <Link
          to="/admin/events/new"
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition duration-200"
        >
          {isRtl ? 'إنشاء حدث جديد' : 'Create New Event'}
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;