import { createContext } from 'react';

const UserContext = createContext({
  user: null, // User object or null
  setUser: () => {} // Function like setState()
});

export default UserContext;
