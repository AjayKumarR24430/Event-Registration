import { createContext, useContext } from 'react';

const eventContext = createContext();

// Create a custom hook to use the event context
const useEventContext = () => useContext(eventContext);

export default useEventContext;
export { eventContext };