import { createContext, useContext } from 'react';

const authContext = createContext();

// Create a custom hook to use the auth context
const useAuthContext = () => useContext(authContext);

export default useAuthContext;
export { authContext };