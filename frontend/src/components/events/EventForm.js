import React, { useState, useEffect } from 'react';
import useEventContext from '../../contexts/event/eventContext';
import useRtlContext from '../../contexts/rtl/rtlContext';
import Alert from '../layout/Alert';
import Spinner from '../layout/Spinner';

const EventForm = ({ event: initialEvent, isEditing, onComplete }) => {
  const { addEvent, updateEvent, getEvents, loading, error } = useEventContext();
  const { isRtl } = useRtlContext();
  
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: 0,
    category: '',
    capacity: 0
  });

  const categories = [
    { value: 'conference', label: isRtl ? 'مؤتمر' : 'Conference' },
    { value: 'workshop', label: isRtl ? 'ورشة عمل' : 'Workshop' },
    { value: 'seminar', label: isRtl ? 'ندوة' : 'Seminar' },
    { value: 'networking', label: isRtl ? 'تواصل' : 'Networking' },
    { value: 'other', label: isRtl ? 'أخرى' : 'Other' }
  ];
  
  useEffect(() => {
    if (isEditing && initialEvent) {
      const eventDate = new Date(initialEvent.date);
      const formattedDate = eventDate.toISOString().slice(0, 16);
      
      setFormData({
        title: initialEvent.title || '',
        description: initialEvent.description || '',
        date: formattedDate,
        location: initialEvent.location || '',
        price: initialEvent.price || 0,
        category: initialEvent.category || '',
        capacity: initialEvent.capacity || 0
      });
    }
  }, [isEditing, initialEvent]);
  
  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: error });
    }
  }, [error]);
  
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      availableSpots: parseInt(formData.capacity)
    };
    
    try {
      if (isEditing) {
        await updateEvent(initialEvent._id, eventData);
        setAlert({ type: 'success', message: 'Event updated successfully!' });
      } else {
        await addEvent(eventData);
        setAlert({ type: 'success', message: 'Event created successfully!' });
        setFormData({
          title: '',
          description: '',
          date: '',
          location: '',
          price: 0,
          category: '',
          capacity: 0
        });
      }
      
      onComplete();
      await getEvents();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };
  
  if (loading) return <Spinner />;
  
  return (
    <div className="max-w-4xl mx-auto">
      {alert && <Alert type={alert.type} message={alert.message} className="mb-6" />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Title Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="title">
              {isRtl ? 'عنوان الفعالية' : 'Event Title'}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={isRtl ? 'أدخل عنوان الفعالية' : 'Enter event title'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
            />
          </div>

          {/* Description Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="description">
              {isRtl ? 'وصف الفعالية' : 'Event Description'}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder={isRtl ? 'اكتب وصفاً تفصيلياً للفعالية' : 'Write a detailed description of the event'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
            ></textarea>
          </div>

          {/* Date & Location Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="date">
                {isRtl ? 'التاريخ والوقت' : 'Date & Time'}
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="location">
                {isRtl ? 'الموقع' : 'Location'}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder={isRtl ? 'أدخل موقع الفعالية' : 'Enter event location'}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              />
            </div>
          </div>

          {/* Category & Price Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="category">
                {isRtl ? 'التصنيف' : 'Category'}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
              >
                <option value="">{isRtl ? 'اختر التصنيف' : 'Select Category'}</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">
                {isRtl ? 'السعر' : 'Price'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Capacity Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="capacity">
              {isRtl ? 'السعة' : 'Capacity'}
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder={isRtl ? 'أدخل العدد الأقصى للمشاركين' : 'Enter maximum number of participants'}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <button
            type="button"
            onClick={onComplete}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {isRtl ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2 rtl:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isEditing
              ? (isRtl ? 'تحديث الفعالية' : 'Update Event')
              : (isRtl ? 'إنشاء الفعالية' : 'Create Event')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;