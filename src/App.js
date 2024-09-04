import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
  ]);

  return (
    <UserContext.Provider value={{
      user: user,
      setUser: setUser
    }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
