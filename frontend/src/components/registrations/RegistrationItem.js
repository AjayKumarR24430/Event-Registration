import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RegistrationContext } from '../../contexts/registration/registrationContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';

const RegistrationItem = ({ registration, isAdmin }) => {
  const registrationContext = useContext(RegistrationContext);
  const rtlContext = useContext(RtlContext);
  
  const { approveRegistration, rejectRegistration, cancelRegistration } = registrationContext;
  const { isRtl } = rtlContext;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', options);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status) => {
    if (isRtl) {
      switch (status) {
        case 'pending':
          return 'قيد الانتظار';
        case 'approved':
          return 'تمت الموافقة';
        case 'rejected':
          return 'مرفوض';
        default:
          return status;
      }
    } else {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Extract event data regardless of whether it's populated or not
  const event = registration.event;
  const eventId = event._id || event;
  const eventTitle = event.title || 'Loading...';
  const eventDate = event.date ? formatDate(event.date) : 'N/A';
  
  // Extract user data for admin view
  const user = registration.user || {};
  const username = user.username || user.email || 'Unknown User';
  
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="py-3 px-4">
        <Link to={`/events/${eventId}`} className="text-primary-600 hover:underline font-medium">
          {eventTitle}
        </Link>
      </td>
      <td className="py-3 px-4 text-gray-700">{eventDate}</td>
      
      {isAdmin && (
        <td className="py-3 px-4 text-gray-700">{username}</td>
      )}
      
      <td className="py-3 px-4">
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(registration.status)}`}>
          {getStatusText(registration.status)}
        </span>
      </td>
      
      <td className="py-3 px-4 text-gray-700">
        {formatDate(registration.createdAt)}
      </td>
      
      <td className="py-3 px-4 text-right">
        {isAdmin && registration.status === 'pending' && (
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => approveRegistration(registration._id)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition duration-200"
            >
              {isRtl ? 'موافقة' : 'Approve'}
            </button>
            <button
              onClick={() => rejectRegistration(registration._id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition duration-200"
            >
              {isRtl ? 'رفض' : 'Reject'}
            </button>
          </div>
        )}
        
        {!isAdmin && registration.status === 'pending' && (
          <button
            onClick={() => cancelRegistration(registration._id)}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition duration-200"
          >
            {isRtl ? 'إلغاء' : 'Cancel'}
          </button>
        )}
      </td>
    </tr>
  );
};

export default RegistrationItem;