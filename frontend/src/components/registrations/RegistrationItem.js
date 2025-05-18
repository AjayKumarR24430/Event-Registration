import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaClock, FaCheck, FaTimes, 
  FaExclamationTriangle, FaEye, FaSpinner, FaInfoCircle 
} from 'react-icons/fa';

const RegistrationItem = ({ registration, isAdmin }) => {
  const registrationContext = useRegistrationContext();
  const rtlContext = useRtlContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const { approveRegistration, rejectRegistration, cancelRegistration } = registrationContext;
  const { isRtl } = rtlContext;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', options);
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', options);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaExclamationTriangle className="w-3 h-3" />;
      case 'approved':
        return <FaCheck className="w-3 h-3" />;
      case 'rejected':
        return <FaTimes className="w-3 h-3" />;
      default:
        return <FaInfoCircle className="w-3 h-3" />;
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
  const event = registration.event || {};
  const eventId = typeof event === 'object' ? event._id : event || 'unknown';
  const eventTitle = event.title || 'Event Unavailable';
  const eventDate = event.date ? formatDate(event.date) : 'N/A';
  const eventLocation = event.location || 'Location not specified';
  
  // Extract user data for admin view
  const user = registration.user || {};
  const username = user.username || user.email || 'Unknown User';
  
  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approveRegistration(registration._id);
    } catch (error) {
      console.error('Error approving registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsLoading(true);
      const reason = window.prompt(isRtl ? 'الرجاء إدخال سبب الرفض:' : 'Please enter rejection reason:');
      if (reason !== null) {
        await rejectRegistration(registration._id, reason);
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      const confirmed = window.confirm(
        isRtl 
          ? 'هل أنت متأكد من رغبتك في إلغاء هذا التسجيل؟' 
          : 'Are you sure you want to cancel this registration?'
      );
      if (confirmed) {
        await cancelRegistration(registration._id);
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <div>
            <Link to={`/events/${eventId}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
              {eventTitle}
            </Link>
            {typeof event === 'object' && event.category && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.category}</p>
            )}
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <FaCalendarAlt className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">{eventDate}</span>
          </div>
        </td>
        
        {isAdmin && (
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{username}</div>
                {user.email && user.email !== username && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                )}
              </div>
            </div>
          </td>
        )}
        
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(registration.status)}`}>
            {getStatusIcon(registration.status)}
            {getStatusText(registration.status)}
          </span>
          {registration.status === 'rejected' && registration.rejectionReason && (
            <button 
              onClick={toggleDetails}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-2 underline"
            >
              {isRtl ? 'عرض السبب' : 'View reason'}
            </button>
          )}
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <FaClock className="w-4 h-4 text-gray-400 mr-2" />
            {formatDate(registration.createdAt)}
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {isAdmin && registration.status === 'pending' && (
            <div className="flex space-x-2 justify-end">
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="btn btn-sm btn-success flex items-center gap-1"
              >
                {isLoading ? (
                  <FaSpinner className="w-3 h-3 animate-spin" />
                ) : (
                  <FaCheck className="w-3 h-3" />
                )}
                <span>{isRtl ? 'موافقة' : 'Approve'}</span>
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="btn btn-sm btn-danger flex items-center gap-1"
              >
                {isLoading ? (
                  <FaSpinner className="w-3 h-3 animate-spin" />
                ) : (
                  <FaTimes className="w-3 h-3" />
                )}
                <span>{isRtl ? 'رفض' : 'Reject'}</span>
              </button>
              <button
                onClick={toggleDetails}
                className="btn btn-sm btn-outline flex items-center gap-1"
                title={isRtl ? 'عرض التفاصيل' : 'View Details'}
              >
                <FaEye className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {!isAdmin && registration.status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="btn btn-sm btn-outline-danger flex items-center gap-1"
            >
              {isLoading ? (
                <FaSpinner className="w-3 h-3 animate-spin" />
              ) : (
                <FaTimes className="w-3 h-3" />
              )}
              <span>{isRtl ? 'إلغاء' : 'Cancel'}</span>
            </button>
          )}
          
          {!isAdmin && registration.status !== 'pending' && (
            <button
              onClick={toggleDetails}
              className="btn btn-sm btn-outline flex items-center gap-1"
              title={isRtl ? 'عرض التفاصيل' : 'View Details'}
            >
              <FaEye className="w-3 h-3" />
            </button>
          )}
        </td>
      </tr>
      
      {/* Expandable Details Row */}
      {showDetails && (
        <tr className="bg-gray-50 dark:bg-gray-800/50">
          <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4">
            <div className="card-glass p-4 my-2">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
                {isRtl ? 'تفاصيل التسجيل' : 'Registration Details'}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">{isRtl ? 'معرف التسجيل' : 'Registration ID'}:</p>
                  <p className="font-mono text-gray-800 dark:text-gray-200">{registration._id}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">{isRtl ? 'وقت التسجيل' : 'Registration Time'}:</p>
                  <p className="text-gray-800 dark:text-gray-200">{formatDateTime(registration.createdAt)}</p>
                </div>
                
                {registration.status === 'approved' && registration.approvedAt && (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 mb-1">{isRtl ? 'وقت الموافقة' : 'Approval Time'}:</p>
                    <p className="text-gray-800 dark:text-gray-200">{formatDateTime(registration.approvedAt)}</p>
                  </div>
                )}
                
                {registration.status === 'rejected' && (
                  <>
                    {registration.rejectedAt && (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">{isRtl ? 'وقت الرفض' : 'Rejection Time'}:</p>
                        <p className="text-gray-800 dark:text-gray-200">{formatDateTime(registration.rejectedAt)}</p>
                      </div>
                    )}
                    {registration.rejectionReason && (
                      <div className="col-span-2">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">{isRtl ? 'سبب الرفض' : 'Rejection Reason'}:</p>
                        <p className="text-gray-800 dark:text-gray-200 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900/30">
                          {registration.rejectionReason || (isRtl ? 'لم يتم تحديد سبب' : 'No reason specified')}
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                {typeof event === 'object' && event.location && (
                  <div className="col-span-2">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">{isRtl ? 'الموقع' : 'Location'}:</p>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-800 dark:text-gray-200">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default RegistrationItem;