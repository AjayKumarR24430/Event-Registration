import React, { useReducer } from 'react';
import axios from 'axios';
import { authContext } from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import api from '../../utils/api';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = (props) => {
    const initialState = {
      token: localStorage.getItem('token'),
      isAuthenticated: localStorage.getItem('token') ? true : false, // Set initial value based on token
      loading: localStorage.getItem('token') ? true : false, // Only set loading if we need to fetch user
      user: null,
      error: null
    };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await api.get('/auth/me');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      dispatch({
        type: USER_LOADED,
        payload: res.data.user
      });
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.error || 'Registration failed'
      });
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      dispatch({
        type: USER_LOADED,
        payload: res.data.user
      });

      return true; // Return true on success
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.error || 'Invalid credentials'
      });
      return false; // Return false on failure
    }
  };

  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <authContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors
      }}
    >
      {props.children}
    </authContext.Provider>
  );
};

export default AuthState;