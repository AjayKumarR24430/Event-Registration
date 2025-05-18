import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegistrationContext from '../contexts/registration/registrationContext';
import useAuthContext from '../contexts/auth/authContext';
import PendingRegistrations from '../components/admin/PendingRegistrations';
import Spinner from '../components/layout/Spinner';
import { FaCalendarCheck, FaClock, FaCheckCircle, FaTimesCircle, FaUserCheck } from 'react-icons/fa';

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
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!adminRegistrations) return [];
    return adminRegistrations
      .filter(reg => {
        // Filter by status
        if (filter !== 'all' && reg.status !== filter) return false;
        
        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchesName = reg.user?.name?.toLowerCase().includes(term);
          const matchesEmail = reg.user?.email?.toLowerCase().includes(term);
          const matchesEvent = reg.event?.title?.toLowerCase().includes(term);
          
          return matchesName || matchesEmail || matchesEvent;
        }
        
        return true;
      });
  }, [adminRegistrations, filter, searchTerm]);

  if (isInitialLoad && loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-center items-center pt-20">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 pt-8 pb-16 px-4 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Registration Management</h1>
          <p className="text-blue-100 text-lg">
            Review, approve, and manage event registrations
          </p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 flex items-center ${filter === 'all' ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:shadow-lg'}`}
            onClick={() => setFilter('all')}
          >
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
              <FaUserCheck className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">All Registrations</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.registrations?.total || 0}</p>
            </div>
          </div>
          
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 flex items-center ${filter === 'pending' ? 'ring-2 ring-yellow-500 transform scale-105' : 'hover:shadow-lg'}`}
            onClick={() => setFilter('pending')}
          >
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
              <FaClock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.registrations?.pending || 0}</p>
            </div>
          </div>
          
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 flex items-center ${filter === 'approved' ? 'ring-2 ring-green-500 transform scale-105' : 'hover:shadow-lg'}`}
            onClick={() => setFilter('approved')}
          >
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
              <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.registrations?.approved || 0}</p>
            </div>
          </div>
          
          <div 
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-300 flex items-center ${filter === 'rejected' ? 'ring-2 ring-red-500 transform scale-105' : 'hover:shadow-lg'}`}
            onClick={() => setFilter('rejected')}
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mr-4">
              <FaTimesCircle className="w-6 h-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.registrations?.rejected || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, email, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Registrations List */}
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {filteredRegistrations.length > 0 ? (
            <PendingRegistrations 
              registrations={filteredRegistrations}
              onApprove={handleApprove}
              onReject={handleReject}
              filter={filter}
            />
          ) : (
            <div className="text-center py-16">
              <FaCalendarCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">No registrations found</h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                {filter !== 'all' 
                  ? `There are no ${filter} registrations at the moment.` 
                  : 'There are no registrations matching your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRegistrationsPage;