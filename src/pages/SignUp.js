import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { todoAPI } from '../api/todoAPI';
import UserContext from '../contexts/UserContext';

function SignUp() {
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState('');
  const [requestInProgress, setRequestInProgress] = useState(false);

  const [genericError, setGenericError] = useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault();

    setGenericError('');
    setNameError('');
    setLastNameError('');
    setPasswordError('');
    setEmailError('');
    setPasswordConfirmationError('');

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

    if (name === '') {
      setNameError('Enter your name');
      setGenericError('Pleas fill in all field');
      return;
    }

    if (lastName === '') {
      setLastNameError('Enter your last name');
      setGenericError('Pleas fill in all field');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordConfirmationError('Passwords do not match');
      return;
    }

    if (
      !email.length ||
      !password.length ||
      !name.length ||
      !lastName.length ||
      !confirmPassword.length
    ) {
      setGenericError('Pleas fill in all field');
      return;
    }

    setRequestInProgress(true);

    todoAPI
      .post('/users', {
        user: {
          email: email,
          password: password,
          name: name,
          last_name: lastName,
        },
      })
      .then((resp) => {
        localStorage.setItem('authorization', `${resp.headers.authorization}`);
        setUser(resp.data);
        navigate('/');
      })
      .catch((err) => {
        console.error('Sign up request failed', err.response?.data);
        if (!err.response?.data.errors) {
          setGenericError('Unexpected error, please try again later');
          return;
        }

        if (err.response.data.errors.email) {
          setEmailError(err.response.data.errors.email.join(', '));
        }

        if (err.response.data.errors.name) {
          setNameError(err.response.data.errors.name.join(', '));
        }

        if (err.response.data.errors.last_name) {
          setLastNameError(err.response.data.errors.last_name.join(', '));
        }

        if (err.response.data.errors.password) {
          setPasswordError(err.response.data.errors.password.join(', '));
        }
      })
      .finally(() => {
        setRequestInProgress(false);
      });
  };

  return (
    <div className="m-auto h-96 w-80">
      <section className="box-border flex w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Create account</h2>
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
            <label htmlFor="user-name" className="form-field-lable">
              Name
            </label>
            <input
              type="text"
              id="user-name"
              className={`box-border w-full rounded-lg border-2 border-solid border-blue-900 px-4 py-2 text-base font-medium text-black ${nameError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setNameError('');
                setName(evt.target.value);
              }}
            />
            {nameError && <div className="text-red-500">{nameError}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="user-last-name" className="form-field-lable">
              Surname
            </label>
            <input
              type="text"
              id="user-last-name"
              className={`box-border w-full rounded-lg border-2 border-solid border-blue-900 px-4 py-2 text-base font-medium text-black ${lastNameError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setLastNameError('');
                setLastName(evt.target.value);
              }}
            />
            {lastNameError && (
              <div className="text-red-500">{lastNameError}</div>
            )}
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
                if (evt.target.value === confirmPassword) {
                  setPasswordConfirmationError('');
                }
              }}
            />
            {passwordError && (
              <div className="text-red-500">{passwordError}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="user-confirm-password" className="form-field-lable">
              Confirm password
            </label>
            <input
              type="password"
              minLength="6"
              id="user-confirm-password"
              className={`box-border w-full rounded-lg border-2 border-solid border-blue-900 px-4 py-2 text-base font-medium text-black ${passwordConfirmationError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setConfirmPassword(evt.target.value);
                if (evt.target.value === password) {
                  setPasswordConfirmationError('');
                }
              }}
            />
            {passwordConfirmationError && (
              <div className="text-red-500">{passwordConfirmationError}</div>
            )}
          </div>

          <button
            type="submit"
            className="cursor-pointer rounded-lg border-none bg-blue-900 px-4 py-3 text-base font-normal text-stone-100"
            disabled={requestInProgress}
          >
            Sign up
          </button>

          {genericError && (
            <div className="mt-2 text-red-500">{genericError}</div>
          )}
        </form>
      </section>
    </div>
  );
}

export default SignUp;
