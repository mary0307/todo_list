import React from 'react';

import './SignUp.css';

function SignUp() {
  return (
    <div className="sign-up__page">
      <section className="sign-up">
        <h2 className="sign-up-page-name">
          Create account
        </h2>
        <form className="sign-up-form">
          <div className="form-field">
            <label htmlFor="user-email" className="form-field-lable">Email</label>
            <input type="email" id="user-email" className="form-input" required />
          </div>

          <div className="form-field">
            <label htmlFor="user-password" className="form-field-lable">Password</label>
            <input type="password" id="user-password" className="form-input" required />
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
