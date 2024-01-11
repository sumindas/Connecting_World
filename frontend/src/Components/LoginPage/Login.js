import React from 'react';
import './Login.css';

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white max-w-md p-8 rounded-md shadow-lg">
        <h1 className="text-4xl font-semibold mb-6 text-center">Welcome to Connecting World</h1>
        <form className="form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Mobile number or Email"
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
            Log In
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <button onClick={handleRegister} className="register-button">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
