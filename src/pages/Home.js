import React, { useContext, useState } from 'react';

import UserContext from '../contexts/UserContext';

function Home() {
  const { user } = useContext(UserContext);
  const [requestInProgress, setRequestInProgress] = useState(false);

  setRequestInProgress(true);

  setRequestInProgress(false);

  return (
    <>
      <p>{user?.name}</p>
      <button
        type="submit"
        className="cursor-pointer rounded-lg border-none bg-blue-900 px-4 py-3 text-base font-normal text-stone-100"
        // disabled={requestInProgress}
      >
        Sign out
      </button>
    </>
  );
}

export default Home;
