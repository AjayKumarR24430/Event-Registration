import React, { useState, useContext } from 'react';
import { EventContext } from '../../contexts/event/eventContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';

const SearchEvents = () => {
  const eventContext = useContext(EventContext);
  const rtlContext = useContext(RtlContext);
  const { searchEvents, clearSearch } = eventContext;
  const { isRtl } = rtlContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  
  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim() === '' && searchDate === '') {
      clearSearch();
      return;
    }
    
    searchEvents({ term: searchTerm, date: searchDate });
  };
  
  const handleClear = () => {
    setSearchTerm('');
    setSearchDate('');
    clearSearch();
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-grow">
          <label htmlFor="searchTerm" className="sr-only">
            {isRtl ? 'بحث عن الأحداث' : 'Search Events'}
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder={isRtl ? 'البحث حسب العنوان أو الوصف...' : 'Search by title or description...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label htmlFor="searchDate" className="sr-only">
            {isRtl ? 'تاريخ الحدث' : 'Event Date'}
          </label>
          <input
            type="date"
            id="searchDate"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200"
          >
            {isRtl ? 'بحث' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            {isRtl ? 'مسح' : 'Clear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchEvents;