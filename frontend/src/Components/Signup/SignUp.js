import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { setError,setEmail } from '../../Redux/Slice/authSlice'
import { signUpAsync } from '../../Redux/Actions/authActions'
import { GoogleLogin } from 'react-google-login'

export const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authError = useSelector((state) => state.auth.error)
 
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
    username: '',
    password: '',
  });
  const [validationError, setValidationError] = useState({
    email: '',
    full_name: '',
    username: '',
    password: '',
  })

   
  
  const handleSignup = async (e) =>{
    e.preventDefault()
    const validateForm = () => {
      const errors = {
        email: '',
        full_name: '',
        username: '',
        password: '',
      };
  
  
      if (!userData.email) {
        errors.email = 'Email is required';

      }
  
      if (!userData.full_name) {
        errors.full_name = 'Fullname is required';
   
      } else if (/\s/.test(userData.full_name)) {
        errors.full_name = 'Fullname cannot contain spaces';
  
      }
  
     
      if (!userData.username) {
        errors.username = 'Username is required';
   
      } else if (/\s/.test(userData.username)) {
        errors.username = 'Username cannot contain spaces';
      
      }
  
      if (!userData.password) {
        errors.password = 'Password is required';
    
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(userData.password)) {
        errors.password =
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit';

      }
  
      setValidationError(errors);
  
      return Object.values(errors).every((error) => error === '');
    }
    if (validateForm){
      dispatch(setError(''))
      dispatch(setEmail(userData.email))
      dispatch(signUpAsync(userData,navigate))
    }else{
      setError(validationError.error)
    }
  }

  return (
    <div className="signup">
      <div className="card">
      <div className="left">
        <h2>-<br /> Connecting World SignUp <br />-</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet . </p>
        <span>Have an Account?</span>
        <Link to = '/'>
        <button className='btn btn-primary'>Login</button>
        </Link>

      </div>
      <form className='right' onSubmit={handleSignup}>
        <input type="email" placeholder='Email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })}/>
        {validationError.email && <p style={{ color: 'red' }}>{validationError.email}</p>}
        <input type="text" placeholder='Fullname' value={userData.full_name} onChange={(e) => setUserData({ ...userData, full_name: e.target.value })} />
        {validationError.full_name && <p style={{ color: 'red' }}>{validationError.full_name}</p>}
        <input type="text" placeholder='Username' value={userData.username} onChange={(e) => setUserData({...userData,username: e.target.value })}/>
        {validationError.username && <p style={{ color: 'red' }}>{validationError.username}</p>}
        <input type="password" placeholder='password' value={userData.password} onChange={(e) => setUserData({...userData,password: e.target.value })} />
        {validationError.password && <p style={{ color: 'red' }}>{validationError.password}</p>}
        {authError && <p style={{color:'red'}}>{authError}</p>}
          <button className='btn' type='submit'>Register</button>
          <GoogleLogin className="google-btn"
            clientId="YOUR_GOOGLE_CLIENT_ID"
            buttonText="SignUp with Google"
            cookiePolicy={'single_host_origin'}
          />
      </form>
    </div>
    </div>
  )
}
