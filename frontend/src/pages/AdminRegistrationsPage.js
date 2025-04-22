import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegistrationContext from '../contexts/registration/registrationContext';
import useAuthContext from '../contexts/auth/authContext';
import PendingRegistrations from '../components/admin/PendingRegistrations';

const AdminRegistrationsPage = () => {
  const { 
    getPendingRegistrations, 
    adminRegistrations, 
    loading, 
    approveRegistration, 
    rejectRegistration 
  } = useRegistrationContext();
  
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    getPendingRegistrations();
  }, [isAuthenticated, user, navigate]);

  const handleApprove = async (registrationId) => {
    await approveRegistration(registrationId);
  };

  const handleReject = async (registrationId, reason) => {
    await rejectRegistration(registrationId, reason);
  };

  const filteredRegistrations = adminRegistrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.status === filter;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="loader">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Registrations</h1>
      
      <div className="mb-8">
        <div className="grid grid-cols-4 gap-4">
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'all' ? 'bg-blue-100 border-blue-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            <p className="font-semibold">All</p>
            <p className="text-2xl font-bold">{adminRegistrations.length}</p>
          </div>
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'pending' ? 'bg-yellow-100 border-yellow-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('pending')}
          >
            <p className="font-semibold">Pending</p>
            <p className="text-2xl font-bold">
              {adminRegistrations.filter(reg => reg.status === 'pending').length}
            </p>
          </div>
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'approved' ? 'bg-green-100 border-green-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('approved')}
          >
            <p className="font-semibold">Approved</p>
            <p className="text-2xl font-bold">
              {adminRegistrations.filter(reg => reg.status === 'approved').length}
            </p>
          </div>
          <div 
            className={`cursor-pointer text-center p-4 rounded-lg ${filter === 'rejected' ? 'bg-red-100 border-red-300 border' : 'bg-gray-100'}`}
            onClick={() => setFilter('rejected')}
          >
            <p className="font-semibold">Rejected</p>
            <p className="text-2xl font-bold">
              {adminRegistrations.filter(reg => reg.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
      
      {adminRegistrations.length > 0 ? (
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