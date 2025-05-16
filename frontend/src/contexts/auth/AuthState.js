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
  // Get cached user data
  let cachedUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      cachedUser = JSON.parse(userStr);
    }
  } catch (e) {
    localStorage.removeItem('user');
  }

  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    user: cachedUser,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (!localStorage.token) {
      dispatch({ type: AUTH_ERROR });
      return null;
    }

    try {
      setAuthToken(localStorage.token);
      const res = await api.get('/auth/me');
      
      // Update cached user data
      localStorage.setItem('user', JSON.stringify(res.data));

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
      return res.data;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: AUTH_ERROR });
      return null;
    }
  };

  // Register User
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/signup', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      setAuthToken(res.data.token);

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

      setAuthToken(res.data.token);
      
      // Store both token and user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      return true;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthToken(null);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.error || 'Invalid credentials'
      });
      return false;
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
  };

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