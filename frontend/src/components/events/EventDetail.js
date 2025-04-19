import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventContext } from '../../contexts/event/eventContext';
import { AuthContext } from '../../contexts/auth/authContext';
import { RegistrationContext } from '../../contexts/registration/registrationContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const eventContext = useContext(EventContext);
  const authContext = useContext(AuthContext);
  const registrationContext = useContext(RegistrationContext);
  const rtlContext = useContext(RtlContext);
  
  const { getEvent, event, loading } = eventContext;
  const { isAuthenticated, user } = authContext;
  const { registerForEvent, getMyRegistrations, myRegistrations, error, clearErrors } = registrationContext;
  const { isRtl } = rtlContext;
  
  const [alert, setAlert] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  
  useEffect(() => {
    getEvent(id);
    
    if (isAuthenticated) {
      getMyRegistrations();
    }
    
    // eslint-disable-next-line
  }, [id, isAuthenticated]);
  
  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: error });
      clearErrors();
    }
    
    // Check if user is already registered for this event
    if (myRegistrations && myRegistrations.length > 0 && event) {
      const registration = myRegistrations.find(
        reg => reg.event._id === event._id || reg.event === event._id
      );
      
      if (registration) {
        setAlreadyRegistered(true);
      } else {
        setAlreadyRegistered(false);
      }
    }
    
    // eslint-disable-next-line
  }, [error, myRegistrations, event]);
  
  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    registerForEvent(id);
    setAlert({ type: 'success', message: 'Registration request submitted! Awaiting approval.' });
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', options);
  };
  
  if (loading || !event) {
    return <Spinner />;
  }
  
  const isAdmin = user && user.role === 'admin';
  const hasAvailableSpots = event.availableSpots > 0;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-600 text-white p-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="mt-2 text-primary-100">
            {isRtl ? 'التاريخ والوقت:' : 'Date & Time:'} {formatDate(event.date)}
          </p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap justify-between mb-6">
            <div className="w-full lg:w-2/3 mb-4 lg:mb-0">
              <h2 className="text-xl font-semibold mb-4">{isRtl ? 'التفاصيل' : 'Details'}</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="w-full lg:w-1/4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <p className="text-gray-500">{isRtl ? 'الموقع' : 'Location'}</p>
                  <p className="font-medium">{event.location}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">{isRtl ? 'السعر' : 'Price'}</p>
                  <p className="font-medium">
                    {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">{isRtl ? 'التصنيف' : 'Category'}</p>
                  <p className="font-medium">{event.category}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">{isRtl ? 'المقاعد المتاحة' : 'Available Spots'}</p>
                  <p className="font-medium">
                    {hasAvailableSpots ? event.availableSpots : (
                      <span className="text-red-600">{isRtl ? 'مكتمل' : 'Sold Out'}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            {alreadyRegistered ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                <p>{isRtl ? 'لقد سجلت بالفعل في هذا الحدث' : 'You are already registered for this event'}</p>
                <p className="mt-1 text-sm">
                  {isRtl ? 'يمكنك التحقق من حالة التسجيل في صفحة "تسجيلاتي"' : 
                    'You can check your registration status on "My Registrations" page'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  {hasAvailableSpots ? (
                    <p className="text-green-600">
                      {isRtl ? `${event.availableSpots} مقعد متاح` : `${event.availableSpots} spots available`}
                    </p>
                  ) : (
                    <p className="text-red-600">{isRtl ? 'لا توجد مقاعد متاحة' : 'No spots available'}</p>
                  )}
                </div>
                
                <button
                  onClick={handleRegister}
                  disabled={!hasAvailableSpots || alreadyRegistered || (isAdmin && !isAuthenticated)}
                  className={`px-6 py-2 rounded-lg font-medium 
                    ${(!hasAvailableSpots || alreadyRegistered) 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary-600 text-white hover:bg-primary-700 transition duration-200'}`}
                >
                  {isRtl ? 'التسجيل في الحدث' : 'Register for Event'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isAdmin && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate(`/admin/events/edit/${id}`)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 transition duration-200"
          >
            {isRtl ? 'تحرير الحدث' : 'Edit Event'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetail;