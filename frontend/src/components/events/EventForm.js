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
  
  useEffect(() => {
    if (isEditing && initialEvent) {
      const eventDate = new Date(initialEvent.date);
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
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
      
      // Hide form immediately
      onComplete();
      
      // Refresh events list using context
      await getEvents();
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      {alert && <Alert type={alert.type} message={alert.message} className="mb-4" />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
            {isRtl ? 'العنوان' : 'Title'}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            {isRtl ? 'الوصف' : 'Description'}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
            {isRtl ? 'التاريخ والوقت' : 'Date & Time'}
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
            {isRtl ? 'الموقع' : 'Location'}
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
            {isRtl ? 'السعر' : 'Price'}
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
            {isRtl ? 'الفئة' : 'Category'}
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="capacity">
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onComplete}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            {isRtl ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200"
          >
            {isEditing
              ? (isRtl ? 'تحديث الحدث' : 'Update Event')
              : (isRtl ? 'إنشاء الحدث' : 'Create Event')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;