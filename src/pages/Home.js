import React, { useContext, useEffect, useState } from 'react';

import UserContext from '../contexts/UserContext';
import { todoAPI } from '../api/todoAPI';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [logOutRequestInProgress, setLogOutRequestInProgress] = useState(false);
  const [taskDeleteRequestInProgress, setTaskDeleteRequestInProgress] =
    useState(false);
  const [commentDeleteRequestInProgress, setCommentDeleteRequestInProgress] =
    useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskEditError, setTaskEditError] = useState('');
  const [commentEditError, setCommentEditError] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(undefined);
  const [editingCommentId, setEditingCommentId] = useState(undefined);

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
    setTaskDeleteRequestInProgress(true);
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

    setTaskDeleteRequestInProgress(false);
  };

  const handleCommentDelete = async (id, taskId) => {
    setCommentDeleteRequestInProgress(true);
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

    setCommentDeleteRequestInProgress(false);
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

  const updateTask = async (task, params) => {
    try {
      const resp = await todoAPI.patch(`/tasks/${task.id}`, params, {
        headers: {
          authorization: localStorage.getItem('authorization'),
        },
      });
      const otherTasks = tasks.filter((el) => el.id !== task.id);
      setTasks([resp.data, ...otherTasks].sort((a, b) => a.id - b.id));
      setEditingTaskId(undefined);
      setTaskEditError('');
    } catch (error) {
      setTaskEditError(
        error.response?.data?.errors?.text ||
          'Unexpected error, please try again later',
      );
      console.error(error);
    }
  };

  const updateComment = async (comment, params) => {
    if (comment.text === params.text) {
      setEditingCommentId(undefined);
      return;
    }

    try {
      await todoAPI.patch(
        `/tasks/${comment.task_id}/comments/${comment.id}`,
        params,
        {
          headers: {
            authorization: localStorage.getItem('authorization'),
          },
        },
      );
      loadTasks(true);
      setEditingCommentId(undefined);
      setCommentEditError('');
    } catch (error) {
      setCommentEditError(
        error.response?.data?.errors?.text ||
          'Unexpected error, please try again later',
      );
      console.error(error);
    }
  };

  return (
    <>
      {user ? (
        <>
          <p>{user.name}</p>
          <button
            type='button'
            onClick={handleLogOut}
            className='cursor-pointer rounded-lg border-none bg-blue-900 px-4 py-3 text-base font-normal text-stone-100'
            disabled={logOutRequestInProgress}
          >
            Sign out
          </button>
          <p>
            Tasks: {tasks.length}
          </p>
          <p>
            Active tasks: {tasks.filter((task) => task.status === 'todo').length}
          </p>
          <p>
            Completed tasks: {tasks.filter((task) => task.status === 'done').length}
          </p>
          {tasks.map((task) => (
            <div key={`task-${task.id}`}>
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => {
                    handleTaskDelete(task.id);
                  }}
                  className='bg-orange-600'
                  disabled={taskDeleteRequestInProgress}
                >
                  Delete
                </button>
                {task.id === editingTaskId ? (
                  <>
                    <input
                      id={`task-${task.id}`}
                      className='border-2 border-r-amber-400'
                      type='text'
                      value={task.text}
                      onChange={(evt) => {
                        const otherTasks = tasks.filter(
                          (el) => el.id !== task.id
                        );
                        task.text = evt.target.value;
                        setTasks(
                          [task, ...otherTasks].sort((a, b) => a.id - b.id)
                        );
                      }}
                      onBlur={(evt) => {
                        updateTask(task, { text: evt.target.value });
                      }}
                      onKeyDown={(evt) => {
                        if (evt.key === 'Enter') {
                          evt.target.blur();
                        }
                      }}
                    />
                    {taskEditError && <p>{taskEditError}</p>}
                  </>
                ) : (
                  <p
                    className={task.status === 'done' ? 'line-through' : ''}
                    onClick={() => {
                      setEditingTaskId(task.id);
                      // const otherTasks = tasks.filter(
                      //   (el) => el.id !== task.id
                      // );
                      // task.editMode = true;
                      // setTasks(
                      //   [task, ...otherTasks].sort((a, b) => a.id - b.id)
                      // );
                      setTimeout(() => {
                        const input = document.getElementById(
                          `task-${task.id}`
                        );
                        input.value = task.text;
                        input.focus();
                      }, 100);
                    }}
                  >
                    {task.text}
                  </p>
                )}
                <input
                  className='border-2 border-b-emerald-900'
                  type='checkbox'
                  checked={task.status === 'done'}
                  onChange={(evt) => {
                    updateTask(task, {
                      status: evt.target.checked ? 'done' : 'todo'
                    });
                  }}
                />
              </div>
              {task.comments.map((comment) => (
                <div key={`comment-${comment.id}`} className='ml-8 flex gap-4'>
                  <button
                    type='button'
                    onClick={() => {
                      handleCommentDelete(comment.id, task.id);
                    }}
                    className='bg-amber-300'
                    disabled={commentDeleteRequestInProgress}
                  >
                    Delete
                  </button>
                  {comment.id === editingCommentId ? (
                    <>
                      <input
                        id={`comment-${comment.id}`}
                        className='border-2 border-r-amber-400'
                        type='text'
                        onBlur={(evt) => {
                          updateComment(comment, { text: evt.target.value });
                        }}
                        onKeyDown={(evt) => {
                          if (evt.key === 'Enter') {
                            evt.target.blur();
                          }
                        }}
                      />
                      {commentEditError && <p>{commentEditError}</p>}
                    </>
                  ) : (
                    <p
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setTimeout(() => {
                          const input = document.getElementById(
                            `comment-${comment.id}`
                          );
                          input.value = comment.text;
                          input.focus();
                        }, 100);
                      }}
                    >
                      {comment.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <a href='/signin'>Sign in</a>
      )}
      {user &&
        Object.keys(user).map((prop) => (
          <p key={prop}>
            {prop}: {user[prop]}
          </p>
        ))}
    </>
  );
}

export default Home;
