import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventContext } from '../../contexts/event/eventContext';
import { RtlContext } from '../../contexts/rtl/rtlContext';
import Alert from '../layout/Alert';
import Spinner from '../layout/Spinner';

const EventForm = () => {
  const eventContext = useContext(EventContext);
  const rtlContext = useContext(RtlContext);
  const { addEvent, updateEvent, getEvent, event, loading, error, clearErrors } = eventContext;
  const { isRtl } = rtlContext;
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
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
    if (isEdit) {
      getEvent(id);
    } else {
      clearErrors();
    }
    // eslint-disable-next-line
  }, [id]);
  
  useEffect(() => {
    if (error) {
      setAlert({ type: 'error', message: error });
      clearErrors();
    }
    
    if (isEdit && event && !loading) {
      const eventDate = new Date(event.date);
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      const formattedDate = eventDate.toISOString().slice(0, 16);
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: formattedDate,
        location: event.location || '',
        price: event.price || 0,
        category: event.category || '',
        capacity: event.capacity || 0
      });
    }
    // eslint-disable-next-line
  }, [event, error, loading]);
  
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity)
    };
    
    if (isEdit) {
      updateEvent(id, eventData);
      setAlert({ type: 'success', message: 'Event updated successfully!' });
    } else {
      addEvent(eventData);
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
    
    setTimeout(() => {
      navigate('/admin/events');
    }, 2000);
  };
  
  if (isEdit && loading) return <Spinner />;
  
  return (
    <div className={`container mx-auto px-4 py-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-600 text-white p-6">
          <h1 className="text-2xl font-bold">
            {isEdit 
              ? (isRtl ? 'تحرير الحدث' : 'Edit Event') 
              : (isRtl ? 'إنشاء حدث جديد' : 'Create New Event')}
          </h1>
        </div>
        
        <div className="p-6">
          {alert && <Alert type={alert.type} message={alert.message} />}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            
            <div className="mb-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
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
              
              <div className="mb-4">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                  {isRtl ? 'السعر' : 'Price'}
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                  {isRtl ? 'التصنيف' : 'Category'}
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
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="capacity">
                  {isRtl ? 'السعة' : 'Capacity'}
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/admin/events')}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg mr-2 hover:bg-gray-300 transition duration-200"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition duration-200"
              >
                {isEdit
                  ? (isRtl ? 'تحديث الحدث' : 'Update Event')
                  : (isRtl ? 'إنشاء الحدث' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;