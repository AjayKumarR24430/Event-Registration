import React, { useState } from 'react';

const RejectRegistrationModal = ({ isOpen, onClose, onConfirm, isRtl }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-semibold mb-4">
          {isRtl ? 'سبب الرفض' : 'Rejection Reason'}
        </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 min-h-[100px] focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={isRtl ? 'يرجى ذكر سبب رفض التسجيل...' : 'Please provide a reason for rejection...'}
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              disabled={!reason.trim()}
            >
              {isRtl ? 'تأكيد الرفض' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectRegistrationModal; 