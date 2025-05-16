import {
    GET_REGISTRATIONS,
    ADD_REGISTRATION,
    CANCEL_REGISTRATION,
    UPDATE_REGISTRATION,
    REGISTRATION_ERROR,
    CLEAR_REGISTRATION,
    GET_ADMIN_REGISTRATIONS,
    GET_ADMIN_STATS,
    SET_LOADING,
    GET_EVENT_REGISTRATIONS,
    GET_EVENT_REGISTRATION_STATS
} from '../types';
  
const registrationReducer = (state, action) => {
    switch (action.type) {
      case SET_LOADING:
        return {
          ...state,
          loading: true
        };
      case 'SET_CURRENT_REGISTRATION':
        return {
          ...state,
          current: action.payload,
          loading: false
        };
      case GET_REGISTRATIONS:
        return {
          ...state,
          registrations: action.payload,
          loading: false
        };
      case GET_ADMIN_REGISTRATIONS:
        return {
          ...state,
          adminRegistrations: action.payload,
          loading: false
        };
      case GET_EVENT_REGISTRATIONS:
        return {
          ...state,
          eventRegistrations: action.payload,
          loading: false
        };
      case GET_EVENT_REGISTRATION_STATS:
        return {
          ...state,
          eventStats: action.payload,
          loading: false
        };
      case GET_ADMIN_STATS:
        return {
          ...state,
          stats: action.payload,
          loading: false
        };
      case ADD_REGISTRATION:
        return {
          ...state,
          registrations: [action.payload, ...state.registrations],
          current: action.payload,
          loading: false
        };
      case UPDATE_REGISTRATION:
        return {
          ...state,
          registrations: state.registrations.map(reg =>
            reg._id === action.payload._id ? action.payload : reg
          ),
          current: state.current?._id === action.payload._id ? action.payload : state.current,
          loading: false
        };
      case CANCEL_REGISTRATION:
        return {
          ...state,
          registrations: state.registrations.filter(reg => reg._id !== action.payload),
          current: state.current?._id === action.payload ? null : state.current,
          loading: false
        };
      case REGISTRATION_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case CLEAR_REGISTRATION:
        return {
          ...state,
          current: null,
          error: null,
          loading: false
        };
      default:
        return state;
    }
  };
  
export default registrationReducer;