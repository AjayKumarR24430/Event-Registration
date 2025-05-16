import React, { useState } from 'react';
import useEventContext from '../../contexts/event/eventContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import { toast } from 'react-toastify';

const SearchEvents = () => {
  const { searchEvents, clearSearch, loading, error } = useEventContext();
  const { isRtl } = useRtlContext();
  
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [localError, setLocalError] = useState(null);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    // Validate that at least one field has a value
    if (searchTitle.trim() === '' && searchDate === '' && searchCategory === '') {
      setLocalError(isRtl 
        ? 'يرجى تحديد معيار بحث واحد على الأقل'
        : 'Please provide at least one search criteria');
      return;
    }
    
    try {
      const searchParams = {
        ...(searchTitle.trim() && { title: searchTitle.trim() }),
        ...(searchDate && { date: searchDate }),
        ...(searchCategory && { category: searchCategory })
      };
      
      const results = await searchEvents(searchParams);
      if (results.length === 0) {
        setLocalError(isRtl 
          ? 'لم يتم العثور على أي فعاليات تطابق معايير البحث'
          : 'No events found matching your search criteria');
      }
    } catch (err) {
      console.error('Search error:', err);
      setLocalError(err.message || (isRtl 
        ? 'حدث خطأ أثناء البحث'
        : 'An error occurred while searching'));
    }
  };
  
  const handleClear = async () => {
    setSearchTitle('');
    setSearchDate('');
    setSearchCategory('');
    setLocalError(null);
    await clearSearch();
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSearch(e);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="searchTitle" className="block text-sm font-medium text-gray-700 mb-1">
              {isRtl ? 'البحث عن الفعاليات' : 'Search Events'}
            </label>
            <input
              type="text"
              id="searchTitle"
              value={searchTitle}
              onChange={e => {
                setSearchTitle(e.target.value);
                setLocalError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder={isRtl ? 'ابحث بالعنوان' : 'Search by title'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="searchDate" className="block text-sm font-medium text-gray-700 mb-1">
              {isRtl ? 'التاريخ' : 'Date'}
            </label>
            <input
              type="date"
              id="searchDate"
              value={searchDate}
              onChange={e => {
                setSearchDate(e.target.value);
                setLocalError(null);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="searchCategory" className="block text-sm font-medium text-gray-700 mb-1">
              {isRtl ? 'التصنيف' : 'Category'}
            </label>
            <select
              id="searchCategory"
              value={searchCategory}
              onChange={e => {
                setSearchCategory(e.target.value);
                setLocalError(null);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
              <option value="conference">{isRtl ? 'مؤتمر' : 'Conference'}</option>
              <option value="workshop">{isRtl ? 'ورشة عمل' : 'Workshop'}</option>
              <option value="seminar">{isRtl ? 'ندوة' : 'Seminar'}</option>
              <option value="networking">{isRtl ? 'تواصل' : 'Networking'}</option>
              <option value="other">{isRtl ? 'أخرى' : 'Other'}</option>
            </select>
          </div>
        </div>
        
        {localError && (
          <div className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">
            {localError}
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className={`px-4 py-2 text-gray-700 bg-gray-100 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
            }`}
          >
            {isRtl ? 'مسح' : 'Clear'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-primary-600 text-white rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
            }`}
          >
            {loading ? (isRtl ? 'جاري البحث...' : 'Searching...') : (isRtl ? 'بحث' : 'Search')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchEvents;