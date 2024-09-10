import React, { useContext, useEffect, useState } from 'react';

import UserContext from '../contexts/UserContext';
import { todoAPI } from '../api/todoAPI';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleClick = async () => {
    setRequestInProgress(true);

    try {
      await todoAPI.delete('/users/sign_out', {
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });
      localStorage.setItem('authorization', '');
      setUser(null);
    } catch (error) {
      console.error(error);
      alert('Unexpected error, please try again later');
    }

    setRequestInProgress(false);
  };

  const loadTasks = async () => {
    if (!user) {
      return;
    }

    if (tasks.length) {
      return;
    }

    try {
      const resp = await todoAPI.get('/tasks', {
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });

      setTasks(resp.data);

    } catch (error) {
      console.error(error);
    }
  };

  const loadTasksSync = () => {
    loadTasks();
  };

  useEffect(loadTasksSync, [user]);

  return (
    <>
      {user && (
        <>
          <p>{user?.name}</p>
          <button
            type="button"
            onClick={handleClick}
            className="cursor-pointer rounded-lg border-none bg-blue-900 px-4 py-3 text-base font-normal text-stone-100"
            disabled={requestInProgress}
          >
            Sign out
          </button>
          {tasks.map((task) => (
            <p key={task.id}>
              {task.text}
            </p>
          ))}
        </>
      )}
    </>
  );
}

export default Home;
