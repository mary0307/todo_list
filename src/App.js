import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import SignUp from './pages/SignUp';

function App() {
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

  return <RouterProvider router={router} />;
}

export default App;
