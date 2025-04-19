import React from 'react';
import { useContext } from 'react';
import { RtlContext } from '../../contexts/rtl/rtlContext';
import RegistrationList from '../registrations/RegistrationList';

const PendingRegistrations = () => {
  const rtlContext = useContext(RtlContext);
  const { isRtl } = rtlContext;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isRtl ? 'التسجيلات المعلقة' : 'Pending Registrations'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isRtl 
            ? 'إدارة طلبات التسجيل التي تحتاج إلى موافقة أو رفض'
            : 'Manage registration requests that need approval or rejection'}
        </p>
      </div>
      
      <RegistrationList isAdmin={true} />
    </div>
  );
};

export default PendingRegistrations;