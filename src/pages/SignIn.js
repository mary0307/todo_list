import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { todoAPI } from '../api/todoAPI';
import UserContext from '../contexts/UserContext';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [genericError, setGenericError] = useState('');

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    setGenericError('');
    setPasswordError('');
    setEmailError('');

    if (email === '') {
      setEmailError('Enter your email');
      setGenericError('Pleas fill in all field');
      return;
    }

    if (password === '') {
      setPasswordError('Enter your password');
      setGenericError('Pleas fill in all field');
      return;
    }

    if (!email.length || !password.length) {
      setGenericError('Pleas fill in all field');
      return;
    }

    setRequestInProgress(true);

    try {
      const resp = await todoAPI.post('/users/sign_in', {
        user: {
          email: email,
          password: password,
        },
      });
      localStorage.setItem('authorization', `${resp.headers.authorization}`);
      setUser(resp.data);
      navigate('/');
    } catch (error) {
      console.error(error.response?.data?.error);
      if (error.response?.data?.error) {
        setGenericError(error.response?.data?.error);
      } else {
        setGenericError('Unexpected error, please try again later');
      }
    }

    setRequestInProgress(false);
  };

  return (
    <div className="m-auto h-96 w-80">
      <section className="box-border flex w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Sign In</h2>
        <form
          className="box-border rounded-2xl border-2 border-solid border-blue-900 pb-4 pl-16 pr-16 pt-8 text-center"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label htmlFor="user-email" className="form-field-lable">
              Email
            </label>
            <input
              type="email"
              id="user-email"
              className={`box-border w-full rounded-lg border-2 border-solid border-blue-900 px-4 py-2 text-base font-medium text-black ${emailError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setEmailError('');
                setEmail(evt.target.value);
              }}
            />
            {emailError && <div className="text-red-500">{emailError}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="user-password" className="form-field-lable">
              Password
            </label>
            <input
              type="password"
              minLength="6"
              id="user-password"
              className={`box-border w-full rounded-lg border-2 border-solid border-blue-900 px-4 py-2 text-base font-medium text-black ${passwordError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setPasswordError('');
                setPassword(evt.target.value);
              }}
            />
            {passwordError && (
              <div className="text-red-500">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="cursor-pointer rounded-lg border-none bg-blue-900 px-4 py-3 text-base font-normal text-stone-100"
            disabled={requestInProgress}
          >
            Sign in
          </button>

          {genericError && (
            <div className="mt-2 text-red-500">{genericError}</div>
          )}
        </form>
      </section>
    </div>
  );
}

export default SignIn;
