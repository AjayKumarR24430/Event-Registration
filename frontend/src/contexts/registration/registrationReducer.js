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
  
const registrationReducer = (state, action) => {
    switch (action.type) {
      case SET_LOADING:
        return {
          ...state,
          loading: true
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
      case ADD_REGISTRATION:
        return {
          ...state,
          registrations: [action.payload, ...state.registrations],
          loading: false
        };
      case UPDATE_REGISTRATION:
        return {
          ...state,
          adminRegistrations: state.adminRegistrations.map(reg =>
            reg._id === action.payload._id ? action.payload : reg
          ),
          loading: false
        };
      case CANCEL_REGISTRATION:
        return {
          ...state,
          registrations: state.registrations.filter(reg => reg._id !== action.payload),
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
          error: null
        };
      default:
        return state;
    }
  };
  
export default registrationReducer;