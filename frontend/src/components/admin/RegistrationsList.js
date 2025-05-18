import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useRegistrationContext from '../../contexts/registration/registrationContext';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFilter, FaCheck, FaTimes, FaClock, FaEye, FaTrash, FaPrint, FaFileExport } from 'react-icons/fa';
import moment from 'moment';

const RegistrationsList = () => {
  const { registrations, loading, getAllRegistrations, deleteRegistration } = useRegistrationContext();
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [animateRows, setAnimateRows] = useState(false);
  
  useEffect(() => {
    getAllRegistrations();
    // Start row animation after a small delay
    setTimeout(() => {
      setAnimateRows(true);
    }, 300);
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (!registrations) return;
    
    let filtered = [...registrations];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reg => 
        (reg.user && reg.user.name && reg.user.name.toLowerCase().includes(term)) ||
        (reg.user && reg.user.email && reg.user.email.toLowerCase().includes(term)) ||
        (reg.event && reg.event.title && reg.event.title.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aVal = keys.reduce((obj, key) => obj && obj[key], a);
          bVal = keys.reduce((obj, key) => obj && obj[key], b);
        } else {
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
        }
        
        // Handle different data types
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === 'asc' 
            ? (aVal > bVal ? 1 : -1)
            : (bVal > aVal ? 1 : -1);
        }
      });
    }
    
    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, statusFilter, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key,
        direction: 'asc'
      };
    });
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      deleteRegistration(id);
    }
  };
  
  const formatDate = (date) => {
    return moment(date).format('MMM DD, YYYY - hh:mm A');
  };
  
  const exportToCSV = () => {
    setIsExporting(true);
    
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false);
      alert('Export completed successfully');
    }, 2000);
  };
  
  const printSelected = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one registration to print');
      return;
    }
    alert(`Printing ${selectedRows.length} registrations`);
  };
  
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      const allIds = filteredRegistrations.map(reg => reg._id);
      setSelectedRows(allIds);
    }
    setIsAllSelected(!isAllSelected);
  };
  
  const toggleSelectRow = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium flex items-center gap-1 shadow-sm">
            <FaCheck className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium flex items-center gap-1 shadow-sm">
            <FaTimes className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-medium flex items-center gap-1 shadow-sm animate-pulse">
            <FaClock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-indigo-100 dark:border-indigo-900/10 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 animate-fadeIn">
      {/* Header with animated gradient border */}
      <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registrations Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and track all event registrations</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={exportToCSV}
              disabled={isExporting}
              className="btn bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/70 dark:text-indigo-400 flex items-center gap-2 py-2 transition-all duration-300"
            >
              <FaFileExport className={`w-4 h-4 ${isExporting ? 'animate-spin' : ''}`} />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            
            <button 
              onClick={printSelected}
              disabled={selectedRows.length === 0}
              className={`btn bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/70 dark:text-indigo-400 flex items-center gap-2 py-2 transition-all duration-300 ${
                selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaPrint className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control pl-10 bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400 dark:text-gray-500" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control pl-10 bg-white dark:bg-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table */}
      {filteredRegistrations.length === 0 ? (
        <div className="text-center p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <FaSearch className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Registrations Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters to see more results'
              : 'There are no registrations in the system yet'}
          </p>
          {searchTerm || statusFilter !== 'all' ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="pl-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => handleSort('user.name')}
                  >
                    <span>Attendee</span>
                    {sortConfig.key === 'user.name' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                    {sortConfig.key !== 'user.name' && <FaSort className="ml-1 text-gray-400" />}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => handleSort('event.title')}
                  >
                    <span>Event</span>
                    {sortConfig.key === 'event.title' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                    {sortConfig.key !== 'event.title' && <FaSort className="ml-1 text-gray-400" />}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => handleSort('status')}
                  >
                    <span>Status</span>
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                    {sortConfig.key !== 'status' && <FaSort className="ml-1 text-gray-400" />}
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div 
                    className="flex items-center cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => handleSort('createdAt')}
                  >
                    <span>Registered On</span>
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                    )}
                    {sortConfig.key !== 'createdAt' && <FaSort className="ml-1 text-gray-400" />}
                  </div>
                </th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRegistrations.map((registration, index) => (
                <tr 
                  key={registration._id} 
                  className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-150 ${
                    animateRows ? 'animate-slideUp' : 'opacity-0'
                  }`} 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="pl-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(registration._id)}
                      onChange={() => toggleSelectRow(registration._id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-700 dark:text-indigo-400 font-medium text-sm">
                          {registration.user && registration.user.name 
                            ? registration.user.name.charAt(0).toUpperCase() 
                            : '?'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {registration.user && registration.user.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {registration.user && registration.user.email || 'No email provided'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {registration.event && registration.event.title || 'Unknown Event'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {registration.event && moment(registration.event.date).format('MMM DD, YYYY') || 'No date'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(registration.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(registration.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/registrations/${registration._id}`}
                        className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-800/50 transition-colors duration-200"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(registration._id)}
                        className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50 transition-colors duration-200"
                        title="Delete Registration"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      {filteredRegistrations.length > 0 && (
        <div className="p-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Showing <span className="font-medium">{filteredRegistrations.length}</span> of{' '}
            <span className="font-medium">{registrations.length}</span> registrations
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 rounded-md bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsList; 