import { createContext, useContext } from 'react';

const registrationContext = createContext();

// Create a custom hook to use the event context
const useRegistrationContext = () => useContext(registrationContext);

export default useRegistrationContext;
export { registrationContext };