import React, { useReducer, useCallback } from 'react';
import { registrationContext } from './registrationContext';
import registrationReducer from './registrationReducer';
import api from '../../utils/api';

import {
  GET_REGISTRATIONS,
  ADD_REGISTRATION,
  CANCEL_REGISTRATION,
  UPDATE_REGISTRATION,
  REGISTRATION_ERROR,
  CLEAR_REGISTRATION,
  GET_ADMIN_REGISTRATIONS,
  SET_LOADING,
  GET_ADMIN_STATS,
  GET_EVENT_REGISTRATIONS,
  GET_EVENT_REGISTRATION_STATS
} from '../types';

const RegistrationState = (props) => {
  const initialState = {
    registrations: [],
    adminRegistrations: [],
    eventRegistrations: [],
    eventStats: {},
    stats: null,
    current: null,
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(registrationReducer, initialState);

  // Set Loading
  const setLoading = useCallback(() => dispatch({ type: SET_LOADING }), []);

  // Get User Registrations
  const getUserRegistrations = useCallback(async () => {
    setLoading();
    try {
      const res = await api.get('/registrations');

      dispatch({
        type: GET_REGISTRATIONS,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch registrations'
      });
    }
  }, [setLoading]);

  // Get Admin Stats
  const getAdminStats = useCallback(async () => {
    setLoading();
    try {
      const res = await api.get('/admin/stats');
      
      dispatch({
        type: GET_ADMIN_STATS,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch admin stats'
      });
    }
  }, [setLoading]);

  // Get Admin Registrations
  const getAdminRegistrations = useCallback(async () => {
    setLoading();
    try {
      // Fetch registrations only - stats are fetched separately to avoid circular dependencies
      const registrationsRes = await api.get('/admin/registrations');

      // Update registrations
      dispatch({
        type: GET_ADMIN_REGISTRATIONS,
        payload: registrationsRes.data.data
      });
      
      return registrationsRes.data.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch admin registrations'
      });
      throw err;
    }
  }, [setLoading]);

  // Register for Event
  const registerForEvent = useCallback(async (eventId) => {
    setLoading();
    try {
      const res = await api.post(`/events/${eventId}/register`);

      dispatch({
        type: ADD_REGISTRATION,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error) {
        dispatch({
          type: REGISTRATION_ERROR,
          payload: err.response.data.error
        });
        return err.response.data;
      }
      
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to register for event'
      });
      throw err;
    }
  }, [setLoading]);

  // Cancel Registration
  const cancelRegistration = useCallback(async (id) => {
    setLoading();
    try {
      await api.delete(`/registrations/${id}`);

      dispatch({
        type: CANCEL_REGISTRATION,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to cancel registration'
      });
    }
  }, [setLoading]);

  // Approve Registration
  const approveRegistration = useCallback(async (id) => {
    setLoading();
    try {
      const res = await api.put(`/admin/registrations/${id}/approve`);

      dispatch({
        type: UPDATE_REGISTRATION,
        payload: res.data.data
      });
      
      // Removed getAdminRegistrations call to prevent circular dependencies
      
      return res.data.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to approve registration'
      });
      throw err;
    }
  }, [setLoading]);

  // Reject Registration
  const rejectRegistration = useCallback(async (id, reason) => {
    setLoading();
    try {
      const res = await api.put(`/admin/registrations/${id}/reject`, { reason });

      dispatch({
        type: UPDATE_REGISTRATION,
        payload: res.data.data
      });
      
      // Removed getAdminRegistrations call to prevent circular dependencies
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to reject registration'
      });
      throw err;
    }
  }, [setLoading]);

  // Clear Registration
  const clearRegistration = useCallback(() => {
    dispatch({ type: CLEAR_REGISTRATION });
  }, []);

  // Get User Registration For Event
  const getUserRegistrationForEvent = useCallback(async (eventId) => {
    setLoading();
    try {
      const res = await api.get('/registrations');
      const registration = res.data.data.find(reg => 
        (typeof reg.event === 'object' ? reg.event._id : reg.event) === eventId
      );
      
      dispatch({
        type: 'SET_CURRENT_REGISTRATION',
        payload: registration
      });
      
      return registration || null;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch registration'
      });
      return null;
    }
  }, [setLoading]);

  // Get Event Registrations
  const getEventRegistrations = useCallback(async (eventId) => {
    setLoading();
    try {
      const res = await api.get(`/admin/events/${eventId}/registrations`);
      
      dispatch({
        type: GET_EVENT_REGISTRATIONS,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch event registrations'
      });
      return [];
    }
  }, [setLoading]);

  // Get Event Registration Stats
  const getEventRegistrationStats = useCallback(async () => {
    setLoading();
    try {
      const res = await api.get('/admin/events/registration-stats');
      
      dispatch({
        type: GET_EVENT_REGISTRATION_STATS,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch event registration stats'
      });
      return {};
    }
  }, [setLoading]);

  return (
    <registrationContext.Provider
      value={{
        myRegistrations: state.registrations,
        adminRegistrations: state.adminRegistrations,
        eventRegistrations: state.eventRegistrations,
        eventStats: state.eventStats,
        stats: state.stats,
        current: state.current,
        error: state.error,
        loading: state.loading,
        getUserRegistrations,
        getAdminRegistrations,
        getAdminStats,
        getEventRegistrations,
        getEventRegistrationStats,
        getUserRegistrationForEvent,
        registerForEvent,
        cancelRegistration,
        approveRegistration,
        rejectRegistration,
        clearRegistration
      }}
    >
      {props.children}
    </registrationContext.Provider>
  );
};

export default RegistrationState;