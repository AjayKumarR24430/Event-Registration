import React, { useReducer, useEffect } from 'react';
import { rtlContext } from './rtlContext';
import rtlReducer from './rtlReducer';
import { TOGGLE_RTL } from '../types';

const RtlState = (props) => {
  const initialState = {
    isRtl: localStorage.getItem('isRtl') === 'true' || false,
    translations: {
      // Arabic translations for key UI elements
      en: {
        home: 'Home',
        events: 'Events',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        myRegistrations: 'My Registrations',
        admin: 'Admin',
        eventTitle: 'Event Title',
        eventDescription: 'Event Description',
        eventDate: 'Event Date',
        eventLocation: 'Event Location',
        eventCapacity: 'Capacity',
        eventAvailableSpots: 'Available Spots',
        registerForEvent: 'Register for Event',
        cancelRegistration: 'Cancel Registration',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        approve: 'Approve',
        reject: 'Reject',
        search: 'Search Events',
        createEvent: 'Create Event',
        editEvent: 'Edit Event',
        deleteEvent: 'Delete Event',
        viewEvent: 'View Event',
        submit: 'Submit',
        cancel: 'Cancel',
        welcomeMessage: 'Welcome to the Event Management System',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        username: 'Username'
      },
      ar: {
        home: 'الرئيسية',
        events: 'الفعاليات',
        login: 'تسجيل الدخول',
        register: 'التسجيل',
        logout: 'تسجيل الخروج',
        myRegistrations: 'تسجيلاتي',
        admin: 'المشرف',
        eventTitle: 'عنوان الفعالية',
        eventDescription: 'وصف الفعالية',
        eventDate: 'تاريخ الفعالية',
        eventLocation: 'موقع الفعالية',
        eventCapacity: 'السعة',
        eventAvailableSpots: 'الأماكن المتاحة',
        registerForEvent: 'التسجيل للفعالية',
        cancelRegistration: 'إلغاء التسجيل',
        pending: 'قيد الانتظار',
        approved: 'تمت الموافقة',
        rejected: 'مرفوض',
        approve: 'موافقة',
        reject: 'رفض',
        search: 'البحث عن الفعاليات',
        createEvent: 'إنشاء فعالية',
        editEvent: 'تعديل الفعالية',
        deleteEvent: 'حذف الفعالية',
        viewEvent: 'عرض الفعالية',
        submit: 'إرسال',
        cancel: 'إلغاء',
        welcomeMessage: 'مرحبًا بكم في نظام إدارة الفعاليات',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        username: 'اسم المستخدم'
      }
    }
  };

  const [state, dispatch] = useReducer(rtlReducer, initialState);

  // Toggle RTL direction
  const toggleRtl = () => {
    dispatch({ type: TOGGLE_RTL });
  };

  // Update document direction when RTL state changes
  useEffect(() => {
    document.documentElement.dir = state.isRtl ? 'rtl' : 'ltr';
    document.body.style.textAlign = state.isRtl ? 'right' : 'left';
    localStorage.setItem('isRtl', state.isRtl);
  }, [state.isRtl]);

  // Translate text based on current language
  const t = (key) => {
    const lang = state.isRtl ? 'ar' : 'en';
    return state.translations[lang][key] || key;
  };

  return (
    <rtlContext.Provider
      value={{
        isRtl: state.isRtl,
        toggleRtl,
        t
      }}
    >
      {props.children}
    </rtlContext.Provider>
  );
};

export default RtlState;