import { TOGGLE_RTL } from '../types';

const rtlReducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_RTL:
      return {
        ...state,
        isRtl: !state.isRtl
      };
    default:
      return state;
  }
};

export default rtlReducer;