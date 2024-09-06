import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import UserContext from './contexts/UserContext';
import { todoAPI } from './api/todoAPI';

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

  useEffect(() => {
    if (user) {
      return;
    }

    if (!localStorage.getItem('authorization')) {
      window.location.href = '/signup';
    } else {
      todoAPI
        .get('/me', {
          headers: {
            authorization: localStorage.getItem('authorization'),
          },
        })
        .then((resp) => {
          setUser(resp.data);
        })
        .catch((err) => {
          console.error(err);
          alert('Reload the page');
        });
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
      }}
    >
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
