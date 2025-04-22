import { createContext, useContext } from 'react';

const rtlContext = createContext();

// Create a custom hook to use the rtl context
const useRtlContext = () => useContext(rtlContext);

export default useRtlContext;
export { rtlContext };