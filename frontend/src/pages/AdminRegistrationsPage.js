import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegistrationContext from '../contexts/registration/registrationContext';
import useAuthContext from '../contexts/auth/authContext';
import PendingRegistrations from '../components/admin/PendingRegistrations';
import Spinner from '../components/layout/Spinner';

const AdminRegistrationsPage = () => {
  const { 
    getAdminRegistrations,
    getAdminStats, 
    adminRegistrations,
    stats, 
    loading, 
    approveRegistration, 
    rejectRegistration 
  } = useRegistrationContext();
  
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        getAdminRegistrations(),
        getAdminStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [getAdminRegistrations, getAdminStats]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (isInitialLoad) {
      fetchData().then(() => {
        setIsInitialLoad(false);
      });
    }
  }, [isAuthenticated, user, navigate, isInitialLoad, fetchData]);

  const handleApprove = useCallback(async (registrationId) => {
    try {
      await approveRegistration(registrationId);
    } catch (error) {
      console.error('Error approving registration:', error);
    }
  }, [approveRegistration]);

  const handleReject = useCallback(async (registrationId, reason) => {
    try {
      await rejectRegistration(registrationId, reason);
    } catch (error) {
      console.error('Error rejecting registration:', error);
    }
  }, [rejectRegistration]);

  const filteredRegistrations = useMemo(() => {
    return adminRegistrations?.filter(reg => {
      if (filter === 'all') return true;
      return reg.status === filter;
    }) || [];
  }, [adminRegistrations, filter]);

  if (isInitialLoad && loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Registrations</h1>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'all' ? 'bg-blue-100 border-blue-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            <p className="font-semibold">All</p>
            <p className="text-2xl font-bold">{stats?.registrations?.total || 0}</p>
          </div>
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'pending' ? 'bg-yellow-100 border-yellow-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('pending')}
          >
            <p className="font-semibold">Pending</p>
            <p className="text-2xl font-bold">{stats?.registrations?.pending || 0}</p>
          </div>
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'approved' ? 'bg-green-100 border-green-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('approved')}
          >
            <p className="font-semibold">Approved</p>
            <p className="text-2xl font-bold">{stats?.registrations?.approved || 0}</p>
          </div>
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'rejected' ? 'bg-red-100 border-red-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('rejected')}
          >
            <p className="font-semibold">Rejected</p>
            <p className="text-2xl font-bold">{stats?.registrations?.rejected || 0}</p>
          </div>
        </div>
      </div>
      
      {filteredRegistrations.length > 0 ? (
        <PendingRegistrations 
          registrations={filteredRegistrations}
          onApprove={handleApprove}
          onReject={handleReject}
          filter={filter}
        />
      ) : (
        <div className="text-center my-12">
          <p className="text-xl text-gray-600">No registrations found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrationsPage;