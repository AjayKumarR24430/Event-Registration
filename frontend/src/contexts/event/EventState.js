import React, { useReducer, useCallback } from 'react';
import { eventContext } from './eventContext';
import eventReducer from './eventReducer';
import api from '../../utils/api';

import {
  GET_EVENTS,
  GET_EVENT,
  ADD_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  EVENT_ERROR,
  CLEAR_EVENT,
  FILTER_EVENTS,
  CLEAR_FILTER,
  SET_LOADING
} from '../types';

const EventState = (props) => {
  const initialState = {
    events: [],
    currentEvent: null,
    filtered: null,
    error: null,
    loading: false
  };

  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Set Loading
  const setLoading = useCallback(() => dispatch({ type: SET_LOADING }), []);

  // Get Events with search parameters
  const getEvents = useCallback(async (searchParams = {}) => {
    setLoading();
    try {
      // Build query string from search parameters
      const queryParams = new URLSearchParams();
      
      // Only add parameters that have values
      if (searchParams.title && searchParams.title.trim()) {
        queryParams.append('title', searchParams.title.trim());
      }
      
      if (searchParams.date && searchParams.date.trim()) {
        queryParams.append('date', searchParams.date.trim());
      }
      
      if (searchParams.category && searchParams.category.trim()) {
        queryParams.append('category', searchParams.category.trim());
      }

      const queryString = queryParams.toString();
      const url = `/events${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching events from:', url); // Debug log
      const res = await api.get(url);
      console.log('API Response:', res.data); // Debug log
      
      dispatch({
        type: GET_EVENTS,
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      console.error('Error fetching events:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        response: err.response,
        request: err.request
      }); // More detailed error logging
      
      let errorMessage;
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = err.response?.data?.error || 
          'Unable to fetch events. Please try again later.';
      }
      
      dispatch({
        type: EVENT_ERROR,
        payload: errorMessage
      });
      
      // Clear events on error to prevent showing stale data
      dispatch({
        type: GET_EVENTS,
        payload: []
      });
      
      // Return empty array instead of throwing
      return [];
    }
  }, [setLoading]);

  // Search Events
  const searchEvents = async (searchParams) => {
    setLoading();
    dispatch({ type: CLEAR_EVENT }); // Clear any existing error state
    
    try {
      // Clean up search parameters
      const cleanParams = {};
      
      if (searchParams.title && searchParams.title.trim()) {
        cleanParams.title = searchParams.title.trim();
      }
      
      if (searchParams.date && searchParams.date.trim()) {
        cleanParams.date = searchParams.date.trim();
      }
      
      if (searchParams.category && searchParams.category.trim()) {
        cleanParams.category = searchParams.category.trim();
      }

      // Only perform search if we have at least one search parameter
      const hasSearchParams = Object.values(cleanParams).some(value => value && value.trim() !== '');
      
      if (!hasSearchParams) {
        dispatch({
          type: EVENT_ERROR,
          payload: 'Please provide at least one search criteria'
        });
        return [];
      }

      const events = await getEvents(cleanParams);
      
      // Dispatch events first
      dispatch({
        type: GET_EVENTS,
        payload: events
      });
      
      // Then set error if no events found
      if (events.length === 0) {
        dispatch({
          type: EVENT_ERROR,
          payload: 'No events found matching your search criteria'
        });
      }

      return events;
    } catch (err) {
      console.error('Error searching events:', err);
      const errorMessage = err.response?.data?.error || err.message || 
        'An error occurred while searching. Please try again.';
      
      dispatch({
        type: EVENT_ERROR,
        payload: errorMessage
      });
      
      // Return empty array instead of throwing
      return [];
    }
  };

  // Get Event
  const getEvent = useCallback(async (id) => {
    setLoading();
    try {
      const res = await api.get(`/events/${id}`);

      if (!res.data.data) {
        dispatch({
          type: EVENT_ERROR,
          payload: 'Event not found'
        });
        return null;
      }

      dispatch({
        type: GET_EVENT,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      let errorMessage;
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = err.response?.data?.error || 'Failed to fetch event';
      }
      
      dispatch({
        type: EVENT_ERROR,
        payload: errorMessage
      });
      
      return null;
    }
  }, [setLoading]);

  // Add Event
  const addEvent = async (event) => {
    setLoading();
    try {
      const res = await api.post('/events', event);

      dispatch({
        type: ADD_EVENT,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      let errorMessage;
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = err.response?.data?.error || 'Failed to add event';
      }
      
      dispatch({
        type: EVENT_ERROR,
        payload: errorMessage
      });
      
      return null;
    }
  };

  // Update Event
  const updateEvent = async (event) => {
    setLoading();
    try {
      const res = await api.put(`/events/${event._id}`, event);

      dispatch({
        type: UPDATE_EVENT,
        payload: res.data.data
      });
      
      return res.data.data;
    } catch (err) {
      let errorMessage;
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = err.response?.data?.error || 'Failed to update event';
      }
      
      dispatch({
        type: EVENT_ERROR,
        payload: errorMessage
      });
      
      return null;
    }
  };

  // Delete Event
  const deleteEvent = async (id) => {
    setLoading();
    try {
      await api.delete(`/events/${id}`);

      dispatch({
        type: DELETE_EVENT,
        payload: id
      });
      
      return true;
    } catch (err) {
      let errorMessage;
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        errorMessage = err.response?.data?.error || 'Failed to delete event';
      }
      
      dispatch({
        type: EVENT_ERROR,
        payload: errorMessage
      });
      
      return false;
    }
  };

  // Clear Event
  const clearEvent = () => {
    console.log('Clear event called from:', new Error().stack);
    dispatch({ type: CLEAR_EVENT });
  };

  // Filter Events
  const filterEvents = (text) => {
    dispatch({ type: FILTER_EVENTS, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Clear Search - Modified to prevent unnecessary fetches
  const clearSearch = () => {
    dispatch({ type: CLEAR_EVENT });
    return getEvents(); // Only fetch all events when explicitly clearing
  };

  return (
    <eventContext.Provider
      value={{
        events: state.events,
        currentEvent: state.currentEvent,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        getEvents,
        getEvent,
        getEventById: getEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        clearEvent,
        filterEvents,
        clearFilter,
        searchEvents
      }}
    >
      {props.children}
    </eventContext.Provider>
  );
};

export default EventState;