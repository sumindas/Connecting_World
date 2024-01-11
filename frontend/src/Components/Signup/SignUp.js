import React from 'react';
import './SignUp.css';

const SignUp = () => {
  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign-up logic here
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login navigation or logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white max-w-md p-8 rounded-md shadow-lg">
        <h1 className="text-4xl font-semibold mb-6 text-center">Create an Account</h1>
        <form className="form" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Mobile number or Email"
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            required
          />
          <button type="submit" className="form-button">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <button onClick={handleLogin} className="login-button">
            Log In
          </button>
        </p>
        <p className="text-center mt-4">
          Or sign up with{' '}
          <a href="URL_FOR_GOOGLE_AUTH" className="google-auth-link">
            Google
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
