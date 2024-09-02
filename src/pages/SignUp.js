import React, { useState } from 'react';

import './SignUp.css';
import { todoAPI } from '../api/todoAPI';

function SignUp() {
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
        console.log(resp);
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
    <div className="sign-up__page">
      <section className="sign-up">
        <h2 className="sign-up-page-name">Create account</h2>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="user-email" className="form-field-lable">
              Email
            </label>
            <input
              type="email"
              id="user-email"
              className={`form-input ${emailError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setEmailError('');
                setEmail(evt.target.value);
              }}
            />
            {emailError && <div className="text-red-500">{emailError}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="user-name" className="form-field-lable">
              Name
            </label>
            <input
              type="text"
              id="user-name"
              className={`form-input ${nameError ? `border-red-500` : ''}`}
              required
              onChange={(evt) => {
                setNameError('');
                setName(evt.target.value);
              }}
            />
            {nameError && <div className="text-red-500">{nameError}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="user-last-name" className="form-field-lable">
              Surname
            </label>
            <input
              type="text"
              id="user-last-name"
              className={`form-input ${lastNameError ? `border-red-500` : ''}`}
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

          <div className="form-field">
            <label htmlFor="user-password" className="form-field-lable">
              Password
            </label>
            <input
              type="password"
              minLength="6"
              id="user-password"
              className={`form-input ${passwordError ? `border-red-500` : ''}`}
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

          <div className="form-field">
            <label htmlFor="user-confirm-password" className="form-field-lable">
              Confirm password
            </label>
            <input
              type="password"
              minLength="6"
              id="user-confirm-password"
              className={`form-input ${passwordConfirmationError ? `border-red-500` : ''}`}
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

          <button type="submit" className="form-btn" disabled={requestInProgress}>
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
