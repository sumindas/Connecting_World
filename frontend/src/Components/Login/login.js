import React, { useState } from 'react';
import './login.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setError } from '../../Redux/Slice/authSlice';
import { loginAsync } from '../../Redux/Actions/authActions';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginAsync(loginData, navigate));
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h2>-<br />Connecting World <br />-</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          <span>Don't Have an Account?</span>
          <Link to='/signup'>
            <button className='btn btn-primary'>Register</button>
          </Link>
        </div>
        <form className='right' onSubmit={handleLogin}>
          <input
            type="text"
            placeholder='username'
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
          />
          <input
            type="password"
            placeholder='password'
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          {authError && <p style={{ color: 'red' }}>{authError}</p>}
          <button className='btn' type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
