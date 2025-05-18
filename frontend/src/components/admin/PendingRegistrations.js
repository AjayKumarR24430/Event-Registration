import React, { useState } from 'react';
import useRtlContext from '../../contexts/rtl/rtlContext';
import RegistrationList from '../registrations/RegistrationList';
import { FaClipboardList, FaSearch, FaFilter, FaDownload, FaUserCheck, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const PendingRegistrations = ({ registrations, onApprove, onReject, filter }) => {
  const { isRtl } = useRtlContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  
  const getStatusTitle = () => {
    switch(filter) {
      case 'pending': return 'Pending Registrations';
      case 'approved': return 'Approved Registrations';
      case 'rejected': return 'Rejected Registrations';
      default: return 'All Registrations';
    }
  };
  
  const getStatusColor = () => {
    switch(filter) {
      case 'pending': return 'border-yellow-500';
      case 'approved': return 'border-green-500';
      case 'rejected': return 'border-red-500';
      default: return 'border-blue-500';
    }
  };
  
  // Filter registrations by search term
  const filteredRegistrations = registrations.filter(reg => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      reg.user?.name?.toLowerCase().includes(term) ||
      reg.user?.email?.toLowerCase().includes(term) ||
      reg.event?.title?.toLowerCase().includes(term)
    );
  });
  
  // Sort registrations
  const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
    let comparison = 0;
    
    switch(sortField) {
      case 'name':
        comparison = (a.user?.name || '').localeCompare(b.user?.name || '');
        break;
      case 'email':
        comparison = (a.user?.email || '').localeCompare(b.user?.email || '');
        break;
      case 'event':
        comparison = (a.event?.title || '').localeCompare(b.event?.title || '');
        break;
      case 'date':
        comparison = new Date(a.date) - new Date(b.date);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Export registrations to CSV
  const exportRegistrations = () => {
    if (!registrations || registrations.length === 0) return;
    
    const headers = ['User Name', 'Email', 'Event', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        `"${(reg.user?.name || '').replace(/"/g, '""')}"`,
        `"${(reg.user?.email || '').replace(/"/g, '""')}"`,
        `"${(reg.event?.title || '').replace(/"/g, '""')}"`,
        `"${reg.status}"`,
        `"${new Date(reg.date).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filter}_registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="overflow-hidden">
      <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 border-l-4 ${getStatusColor()}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              {getStatusTitle()} 
              <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                ({filteredRegistrations.length})
              </span>
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                placeholder="Search by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FaSearch className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={exportRegistrations}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 transition-colors"
              >
                <FaDownload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Export</span>
              </button>
              
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden divide-x divide-gray-300 dark:divide-gray-700">
                <button
                  className={`p-2 ${sortDirection === 'asc' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                  onClick={() => setSortDirection('asc')}
                  title="Sort Ascending"
                >
                  <FaSortAmountUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  className={`p-2 ${sortDirection === 'desc' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                  onClick={() => setSortDirection('desc')}
                  title="Sort Descending"
                >
                  <FaSortAmountDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4 overflow-x-auto">
          <button
            className={`py-1 px-3 rounded-full text-sm font-medium ${
              sortField === 'date' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
            onClick={() => handleSort('date')}
          >
            Date
          </button>
          <button
            className={`py-1 px-3 rounded-full text-sm font-medium ${
              sortField === 'name' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
            onClick={() => handleSort('name')}
          >
            User Name
          </button>
          <button
            className={`py-1 px-3 rounded-full text-sm font-medium ${
              sortField === 'email' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
            onClick={() => handleSort('email')}
          >
            Email
          </button>
          <button
            className={`py-1 px-3 rounded-full text-sm font-medium ${
              sortField === 'event' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }`}
            onClick={() => handleSort('event')}
          >
            Event
          </button>
        </div>
      </div>
      
      <RegistrationList 
        isAdmin={true} 
        registrations={sortedRegistrations}
        onApprove={onApprove}
        onReject={onReject}
        filter={filter}
      />
      
      {sortedRegistrations.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900">
          <FaUserCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">No matching registrations</h3>
          <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
            {searchTerm 
              ? 'No registrations match your search criteria.' 
              : `There are no ${filter !== 'all' ? filter : ''} registrations to display.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingRegistrations;