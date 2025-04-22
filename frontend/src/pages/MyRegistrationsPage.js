import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRegistrationContext from '../contexts/registration/registrationContext';
import useAuthContext from '../contexts/auth/authContext';
import RegistrationList from '../components/registrations/RegistrationList';

const MyRegistrationsPage = () => {
  const { getUserRegistrations, userRegistrations, loading, cancelRegistration } = useRegistrationContext();
  const { user, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-registrations' } });
      return;
    }
    
    getUserRegistrations();
  }, [isAuthenticated, navigate]);

  const handleCancelRegistration = async (registrationId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      await cancelRegistration(registrationId);
    }
  };

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
      <h1 className="text-3xl font-bold mb-8">My Registrations</h1>
      
      {userRegistrations.length > 0 ? (
        <div>
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg text-center">
                <p className="font-semibold">Pending</p>
                <p className="text-2xl font-bold">
                  {userRegistrations.filter(reg => reg.status === 'pending').length}
                </p>
              </div>
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-center">
                <p className="font-semibold">Approved</p>
                <p className="text-2xl font-bold">
                  {userRegistrations.filter(reg => reg.status === 'approved').length}
                </p>
              </div>
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
                <p className="font-semibold">Rejected</p>
                <p className="text-2xl font-bold">
                  {userRegistrations.filter(reg => reg.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          
          <RegistrationList 
            registrations={userRegistrations} 
            onCancelRegistration={handleCancelRegistration}
            isAdmin={false}
          />
        </div>
      ) : (
        <div className="text-center my-12">
          <p className="text-xl text-gray-600">You haven't registered for any events yet.</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;