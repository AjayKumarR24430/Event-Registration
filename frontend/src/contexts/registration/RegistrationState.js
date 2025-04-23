import React, { useReducer } from 'react';
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
  SET_LOADING
} from '../types';

const RegistrationState = (props) => {
  const initialState = {
    registrations: [],
    adminRegistrations: [],
    current: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(registrationReducer, initialState);

  // Get User Registrations
  const getUserRegistrations = async () => {
    setLoading();
    try {
      const res = await api.get('/registrations');

      dispatch({
        type: GET_REGISTRATIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch registrations'
      });
    }
  };

  // Get Admin Registrations
  const getAdminRegistrations = async () => {
    setLoading();
    try {
      const res = await api.get('/admin/registrations');

      dispatch({
        type: GET_ADMIN_REGISTRATIONS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch admin registrations'
      });
    }
  };

  // Register for Event
  const registerForEvent = async (eventId) => {
    setLoading();
    try {
      const res = await api.post(`/events/${eventId}/register`);

      dispatch({
        type: ADD_REGISTRATION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to register for event'
      });
      throw err;
    }
  };

  // Cancel Registration
  const cancelRegistration = async (id) => {
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
  };

  // Approve Registration
  const approveRegistration = async (id) => {
    setLoading();
    try {
      const res = await api.put(`/admin/registrations/${id}/approve`);

      dispatch({
        type: UPDATE_REGISTRATION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to approve registration'
      });
      throw err;
    }
  };

  // Reject Registration
  const rejectRegistration = async (id, reason) => {
    setLoading();
    try {
      const res = await api.put(`/admin/registrations/${id}/reject`, { reason });

      dispatch({
        type: UPDATE_REGISTRATION,
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTRATION_ERROR,
        payload: err.response?.data?.error || 'Failed to reject registration'
      });
      throw err;
    }
  };

  // Clear Registration
  const clearRegistration = () => {
    dispatch({ type: CLEAR_REGISTRATION });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <registrationContext.Provider
      value={{
        registrations: state.registrations,
        adminRegistrations: state.adminRegistrations,
        current: state.current,
        error: state.error,
        loading: state.loading,
        getUserRegistrations,
        getAdminRegistrations,
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