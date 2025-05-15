import React, { useReducer } from 'react';
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
    loading: true
  };

  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Get Events with search parameters
  const getEvents = async (searchParams = {}) => {
    setLoading();
    try {
      // Build query string from search parameters
      const queryParams = new URLSearchParams();
      
      // Only add parameters that have values
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = `/events${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching events with URL:', url); // Debug log
      
      const res = await api.get(url);
      
      dispatch({
        type: GET_EVENTS,
        payload: res.data.data
      });

      return res.data.data;
    } catch (err) {
      console.error('Error fetching events:', err); // Debug log
      dispatch({
        type: EVENT_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch events'
      });
      throw err;
    }
  };

  // Search Events
  const searchEvents = async (searchParams) => {
    setLoading();
    try {
      // Clean up search parameters
      const cleanParams = {};
      
      if (searchParams.term) {
        cleanParams.title = searchParams.term;
      }
      
      if (searchParams.date) {
        cleanParams.date = searchParams.date;
      }
      
      if (searchParams.category) {
        cleanParams.category = searchParams.category;
      }

      // Only perform search if we have at least one search parameter
      const hasSearchParams = Object.values(cleanParams).some(value => value && value.trim() !== '');
      
      if (!hasSearchParams) {
        return await getEvents(); // If no search params, get all events
      }

      return await getEvents(cleanParams);
    } catch (err) {
      console.error('Error searching events:', err); // Debug log
      dispatch({
        type: EVENT_ERROR,
        payload: err.response?.data?.error || 'Failed to search events'
      });
      throw err;
    }
  };

  // Get Event
  const getEvent = async (id) => {
    setLoading();
    try {
      const res = await api.get(`/events/${id}`);

      dispatch({
        type: GET_EVENT,
        payload: res.data.data
      });
    } catch (err) {
      dispatch({
        type: EVENT_ERROR,
        payload: err.response?.data?.error || 'Failed to fetch event'
      });
    }
  };

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
      dispatch({
        type: EVENT_ERROR,
        payload: err.response?.data?.error || 'Failed to add event'
      });
      throw err;
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
      dispatch({
        type: EVENT_ERROR,
        payload: err.response?.data?.error || 'Failed to update event'
      });
      throw err;
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
    } catch (err) {
      dispatch({
        type: EVENT_ERROR,
        payload: err.response?.data?.error || 'Failed to delete event'
      });
    }
  };

  // Clear Event
  const clearEvent = () => {
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

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

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
        addEvent,
        updateEvent,
        deleteEvent,
        clearEvent,
        searchEvents,
        clearSearch: () => getEvents()
      }}
    >
      {props.children}
    </eventContext.Provider>
  );
};

export default EventState;