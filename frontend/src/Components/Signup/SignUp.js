import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { setEmail } from '../../Redux/Slice/authSlice';
import { googleLoginAsync, signUpAsync } from '../../Redux/Actions/authActions';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
    username: '',
    password: '',
  });
  console.log(authError);

  const handleGoogleLogin = async (response) => {
    console.log('Response:', response);
    if (response?.tokenID) {
      console.log('Google Login Success');
      dispatch(googleLoginAsync(response.tokenID, navigate));
    } else if (response?.error === 'popup_closed_by_user') {
      console.log('User closed the Google Sign-In popup');
    } else {
      console.log('Login Failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(signUpAsync(userData, navigate));
    dispatch(setEmail(userData.email));
  };

  return (
    <div className="signup">
      <div className="card">
        <div className="left">
          <h2>
            -<br /> Connecting World SignUp <br />-
          </h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet . </p>
          <span>Have an Account?</span>
          <Link to="/">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
        <form className="right" onSubmit={handleSignup}>
          <input type="email" placeholder="Email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
          <input type="text" placeholder="Fullname" value={userData.full_name} onChange={(e) => setUserData({ ...userData, full_name: e.target.value })} />
          <input type="text" placeholder="Username" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
          <input type="password" placeholder="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
          {authError && <p style={{ color: 'red', textAlign: 'center' }}>{authError}</p>}
          <button className='btn register-btn' type='submit'>Register</button>
          <GoogleOAuthProvider className = 'google'>
            <GoogleLogin  clientId="73138496489-k32qantd0csou71vne0tk6kftpshbcks.apps.googleusercontent.com" className="google-btn" buttonText="SignUp with Google" onSuccess={handleGoogleLogin} onFailure={handleGoogleLogin} cookiePolicy={'single_host_origin'} type="submit" jsSrc="https://apis.google.com/js/api.js" />
          </GoogleOAuthProvider>
        </form>
      </div>
    </div>
  );
};
