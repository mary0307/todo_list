import React, { useContext, useEffect, useState } from 'react';

import UserContext from '../contexts/UserContext';
import { todoAPI } from '../api/todoAPI';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [logOutRequestInProgress, setLogOutRequestInProgress] = useState(false);
  const [deleteRequestInProgress, setDeleteRequestInProgress] = useState(false);
  const [tasks, setTasks] = useState([]);

  const handleLogOut = async () => {
    setLogOutRequestInProgress(true);

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

    setLogOutRequestInProgress(false);
  };

  const handleTaskDelete = async (id) => {
    setDeleteRequestInProgress(true);
    try {
      await todoAPI.delete(`/task/${id}`, {
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });
      loadTasks(true);
    } catch (error) {
      if (error.response?.status === 404) {
        loadTasks(true);
        return;
      }

      console.error(error);
      alert('Unexpected error, please try again later');
    }

    setDeleteRequestInProgress(false);
  };

  const handleDeleteComment = async (id, taskId) => {
    setDeleteRequestInProgress(true);
    try {
      await todoAPI.delete(`/tasks/${taskId}/comments/${id}`, {
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });
      loadTasks(true);
    } catch (error) {
      if (error.response?.status === 404) {
        loadTasks(true);
        return;
      }

      console.error(error);
      alert('Unexpected error, please try again later');
    }

    setDeleteRequestInProgress(false);
  };

  const loadTasks = async (force) => {
    if (!user) {
      return;
    }

    if (!force && tasks.length) {
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
            onClick={handleLogOut}
            className="cursor-pointer rounded-lg border-none bg-blue-900 px-4 py-3 text-base font-normal text-stone-100"
            disabled={logOutRequestInProgress}
          >
            Sign out
          </button>
          {tasks.map((task) => (
            <div key={`task-${task.id}`}>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    handleTaskDelete(task.id);
                  }}
                  className="bg-orange-600"
                  disabled={deleteRequestInProgress}
                >
                  Delete
                </button>
                <p>{task.text}</p>
              </div>
              {task.comments.map((comment) => (
                <div key={`comment-${comment.id}`} className="ml-8 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteComment(comment.id, task.id);
                    }}
                    className="bg-amber-300"
                    disabled={deleteRequestInProgress}
                  >
                    Delete
                  </button>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
      {Object.keys(user).map((prop) => (
        <p key={prop}>
          {prop}: {user[prop]}
        </p>
      ))}
    </>
  );
}

export default Home;
