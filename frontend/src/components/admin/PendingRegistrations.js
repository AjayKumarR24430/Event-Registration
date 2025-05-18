import React from 'react';
import useRtlContext from '../../contexts/rtl/rtlContext';
import RegistrationList from '../registrations/RegistrationList';
import { FaClipboardList, FaFilter, FaSearch } from 'react-icons/fa';

const PendingRegistrations = () => {
  const rtlContext = useRtlContext();
  const { isRtl } = rtlContext;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
            <FaClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isRtl ? 'التسجيلات المعلقة' : 'Pending Registrations'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-12">
          {isRtl 
            ? 'إدارة طلبات التسجيل التي تحتاج إلى موافقة أو رفض'
            : 'Manage registration requests that need approval or rejection'}
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 card p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={isRtl ? 'بحث في التسجيلات...' : 'Search registrations...'}
              className="form-control pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-glass py-2.5 px-4 flex items-center gap-2">
              <FaFilter className="w-4 h-4" />
              <span>{isRtl ? 'تصفية' : 'Filter'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Registration List */}
      <div className="card overflow-hidden shadow-lg">
        <RegistrationList isAdmin={true} />
      </div>
    </div>
  );
};

export default PendingRegistrations;