import React, { useState, useEffect } from 'react';

const Alert = ({ type, message, timeout = 5000 }) => {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, timeout);
    
    return () => clearTimeout(timer);
  }, [timeout]);
  
  if (!show) return null;
  
  const alertStyles = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    info: 'bg-blue-100 border-blue-500 text-blue-700',
  };
  
  const styleClass = alertStyles[type] || alertStyles.info;
  
  return (
    <div className={`border-l-4 p-4 mb-6 rounded ${styleClass}`} role="alert">
      <div className="flex">
        <div className="flex-grow">
          <p>{message}</p>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-gray-500 hover:text-gray-800"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;