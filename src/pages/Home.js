import React, { useContext } from 'react';

import UserContext from '../contexts/UserContext';

function Home() {
  const { user } = useContext(UserContext);

  return <>{user?.name}</>;
}

export default Home;
