import React, { useEffect, useContext } from 'react';
import { RegistrationContext } from '../../contexts/registration/registrationContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';
import RegistrationItem from './RegistrationItem';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';

const RegistrationList = ({ isAdmin = false }) => {
  const registrationContext = useContext(RegistrationContext);
  const rtlContext = useContext(RtlContext);
  
  const { 
    getMyRegistrations, 
    getPendingRegistrations, 
    myRegistrations, 
    pendingRegistrations, 
    loading, 
    error 
  } = registrationContext;
  
  const { isRtl } = rtlContext;
  
  useEffect(() => {
    if (isAdmin) {
      getPendingRegistrations();
    } else {
      getMyRegistrations();
    }
    // eslint-disable-next-line
  }, [isAdmin]);
  
  if (loading) {
    return <Spinner />;
  }
  
  const registrations = isAdmin ? pendingRegistrations : myRegistrations;
  
  if (!registrations || registrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">
          {isAdmin
            ? (isRtl ? 'لا توجد تسجيلات معلقة للموافقة عليها' : 'No pending registrations to approve')
            : (isRtl ? 'ليس لديك أي تسجيلات حتى الآن' : 'You don\'t have any registrations yet')}
        </p>
        {!isAdmin && (
          <p className="mt-2">
            {isRtl 
              ? 'استعرض الأحداث المتاحة وسجل في ما يناسبك' 
              : 'Browse available events and register for ones that interest you'}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {error && <Alert type="error" message={error} />}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4">{isRtl ? 'الحدث' : 'Event'}</th>
                <th className="py-3 px-4">{isRtl ? 'التاريخ' : 'Date'}</th>
                {isAdmin && <th className="py-3 px-4">{isRtl ? 'المستخدم' : 'User'}</th>}
                <th className="py-3 px-4">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-4">{isRtl ? 'تاريخ التسجيل' : 'Registered On'}</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(registration => (
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