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
  
const eventReducer = (state, action) => {
    switch (action.type) {
      case SET_LOADING:
        return {
          ...state,
          loading: true
        };
      case GET_EVENTS:
        return {
          ...state,
          events: action.payload,
          error: action.payload.length > 0 ? null : state.error,
          loading: false
        };
      case GET_EVENT:
        return {
          ...state,
          currentEvent: action.payload,
          loading: false
        };
      case ADD_EVENT:
        return {
          ...state,
          events: [action.payload, ...state.events],
          loading: false
        };
      case UPDATE_EVENT:
        return {
          ...state,
          events: state.events.map(event =>
            event._id === action.payload._id ? action.payload : event
          ),
          loading: false
        };
      case DELETE_EVENT:
        return {
          ...state,
          events: state.events.filter(event => event._id !== action.payload),
          loading: false
        };
      case EVENT_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case CLEAR_EVENT:
        return {
          ...state,
          currentEvent: null,
          error: null,
          loading: false
        };
      case FILTER_EVENTS:
        return {
          ...state,
          filtered: state.events.filter(event => {
            const regex = new RegExp(action.payload, 'gi');
            return event.title.match(regex) || event.description.match(regex);
          })
        };
      case CLEAR_FILTER:
        return {
          ...state,
          filtered: null
        };
      default:
        return state;
    }
};
  
export default eventReducer;