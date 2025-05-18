import React, { useEffect, useContext, useState } from 'react';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import RegistrationItem from './RegistrationItem';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import { FaSort, FaCalendarAlt, FaUserAlt, FaRegCheckCircle } from 'react-icons/fa';

const RegistrationList = ({ isAdmin = false }) => {
  const registrationContext = useRegistrationContext();
  const rtlContext = useRtlContext();
  
  const { 
    getUserRegistrations, 
    getAdminRegistrations, 
    myRegistrations, 
    adminRegistrations, 
    loading, 
    error 
  } = registrationContext;
  
  const { isRtl } = rtlContext;
  
  // Sorting state
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    if (isAdmin) {
      getAdminRegistrations();
    } else {
      getUserRegistrations();
    }
    // eslint-disable-next-line
  }, [isAdmin]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sort registrations
  const sortRegistrations = (items) => {
    if (!items || !items.length) return [];
    
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'event':
          // Handle both object and string event ID
          const eventNameA = typeof a.event === 'object' ? a.event.title : 'Unknown Event';
          const eventNameB = typeof b.event === 'object' ? b.event.title : 'Unknown Event';
          comparison = eventNameA.localeCompare(eventNameB);
          break;
        case 'date':
          // Handle both object and string event ID
          const dateA = typeof a.event === 'object' ? new Date(a.event.date) : new Date();
          const dateB = typeof b.event === 'object' ? new Date(b.event.date) : new Date();
          comparison = dateA - dateB;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'user':
          if (isAdmin) {
            const userNameA = typeof a.user === 'object' ? a.user.username : 'Unknown User';
            const userNameB = typeof b.user === 'object' ? b.user.username : 'Unknown User';
            comparison = userNameA.localeCompare(userNameB);
          }
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spinner />
      </div>
    );
  }
  
  const registrations = isAdmin ? adminRegistrations : myRegistrations;
  const sortedRegistrations = sortRegistrations(registrations);
  
  if (!registrations || registrations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <FaRegCheckCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {isAdmin
            ? (isRtl ? 'لا توجد تسجيلات للإدارة' : 'No Registrations to Manage')
            : (isRtl ? 'ليس لديك أي تسجيلات حتى الآن' : 'You Don\'t Have Any Registrations Yet')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          {isAdmin
            ? (isRtl ? 'لا توجد تسجيلات بحاجة للإدارة حالياً' : 'There are no registrations that need management at this time')
            : (isRtl ? 'استعرض الأحداث المتاحة وسجل في ما يناسبك' : 'Browse available events and register for ones that interest you')}
        </p>
        {!isAdmin && (
          <a href="/events" className="btn btn-primary">
            {isRtl ? 'استعرض الفعاليات' : 'Browse Events'}
          </a>
        )}
      </div>
    );
  }
  
  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {error && <Alert type="error" message={error} />}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('event')}
                >
                  <div className="flex items-center gap-2">
                    <span>{isRtl ? 'الفعالية' : 'Event'}</span>
                    {sortField === 'event' && (
                      <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    <span>{isRtl ? 'التاريخ' : 'Date'}</span>
                    {sortField === 'date' && (
                      <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                {isAdmin && (
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center gap-2">
                      <span>{isRtl ? 'المستخدم' : 'User'}</span>
                      {sortField === 'user' && (
                        <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                )}
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    <span>{isRtl ? 'الحالة' : 'Status'}</span>
                    {sortField === 'status' && (
                      <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    <span>{isRtl ? 'تاريخ التسجيل' : 'Registered On'}</span>
                    {sortField === 'createdAt' && (
                      <FaSort className={`w-3 h-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {isRtl ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedRegistrations.map(registration => (
                <RegistrationItem 
                  key={registration._id} 
                  registration={registration} 
                  isAdmin={isAdmin} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationList;