import { createContext } from 'react';

const UserContext = createContext({
  user: null, // stores current logged-in user
  setUser: () => {}, // function to update user
});

export default UserContext;
