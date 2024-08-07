import React, { useState } from 'react';

import './SignUp.css';
import { todoAPI } from '../api/todoAPI';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (password !== confirmPassword ) {
      alert('Passwords do not match');
      return;
    }

    todoAPI.post('/users', {
      user: {
        email: email,
        password: password,
        name: name,
        last_name: lastName
      }
    });
  };

  return (
    <div className="sign-up__page">
      <section className="sign-up">
        <h2 className="sign-up-page-name">
          Create account
        </h2>
        <form className="sign-up-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="user-email" className="form-field-lable">Email</label>
            <input type="email" id="user-email" className="form-input" required
                   onChange={(evt) => setEmail(evt.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="user-name" className="form-field-lable">Name</label>
            <input type="text" id="user-name" className="form-input" required
                   onChange={(evt) => setName(evt.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="user-last-name" className="form-field-lable">Surname</label>
            <input type="text" id="user-last-name" className="form-input" required
                   onChange={(evt) => setLastName(evt.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="user-password" className="form-field-lable">Password</label>
            <input type="password" minLength="6" id="user-password" className="form-input" required
                   onChange={(evt) => setPassword(evt.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="user-confirm-password" className="form-field-lable">Confirm password</label>
            <input type="password" minLength="6" id="user-confirm-password" className="form-input" required
                   onChange={(evt) => setConfirmPassword(evt.target.value)} />
          </div>

          <button type="submit" className="form-btn">
            Sign up
          </button>
        </form>
      </section>
    </div>
  );
}

export default SignUp;
