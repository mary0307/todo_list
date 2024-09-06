import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './SignIn.css';
import { todoAPI } from '../api/todoAPI';
import UserContext from '../contexts/UserContext';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [genericError, setGenericError] = useState('');

  const handleSubmit = (evt) => {
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

    // todoAPI
    //   .post('/users', {
    //     user: {
    //       email: email,
    //       password: password
    //     },
    //   })
    //   .then((resp) => {
    //     localStorage.setItem('authorization', `${resp.headers.authorization}`);
    //     setUser(resp.data);
    //     navigate('/');
    //   })
    //   .catch((err) => {
    //     console.error('Sign up request failed', err.response?.data);
    //     if (!err.response?.data.errors) {
    //       setGenericError('Unexpected error, please try again later');
    //       return;
    //     }
    //
    //     if (err.response.data.errors.email) {
    //       setEmailError(err.response.data.errors.email.join(', '));
    //     }
    //
    //     if (err.response.data.errors.password) {
    //       setPasswordError(err.response.data.errors.password.join(', '));
    //     }
    //   })
    //   .finally(() => {
    //     setRequestInProgress(false);
    //   });
  };

  return (
    <div className="sign-in__page">
      <section className="sign-in">
        <h2 className="sign-in-page-name">Sign In</h2>
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="user-email" className="form-field-lable">
              Email
            </label>
            <input
              type="email"
              id="user-email"
              className={`form-input ${emailError ? `border-red-500` : ''}`}
              // required
              onChange={(evt) => {
                setEmailError('');
                setEmail(evt.target.value);
              }}
            />
            {emailError && <div className="text-red-500">{emailError}</div>}
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
              // required
              onChange={(evt) => {
                setPasswordError('');
                setPassword(evt.target.value);
                }
              }
            />
            {passwordError && (
              <div className="text-red-500">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="form-btn"
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
