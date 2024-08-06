import React, { useState } from 'react';

import './SignUp.css';
import { todoAPI } from '../api/todoAPI';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault();

    todoAPI.post('/users', {
      user: {
        email: email,
        password: password,
        name: 'John',
        last_name: 'Doe'
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
            <input type="email" id="user-email" className="form-input" required onChange={(evt) => setEmail(evt.target.value)} />
          </div>

          <div className="form-field">
            <label htmlFor="user-password" className="form-field-lable">Password</label>
            <input type="password" id="user-password" className="form-input" required onChange={(evt) => setPassword(evt.target.value)} />
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
