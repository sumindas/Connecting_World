
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { setError } from '../../Redux/Slice/authSlice'
import { signUpAsync } from '../../Redux/Actions/authActions'

export const SignUp = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authError = useSelector((state) => state.auth.error)
 
  const [userData, setUserData] = useState({
    email: '',
    fullname: '',
    username: '',
    password: '',
  });
  const [validationError, setValidationError] = useState({
    email: '',
    fullname: '',
    username: '',
    password: '',
  })

    const validateForm = () => {
      const errors = {
        email: '',
        fullname: '',
        username: '',
        password: '',
      };
  
  
      if (!userData.email) {
        errors.email = 'Email is required';
        return
      }
  
      if (!userData.fullname) {
        errors.fullname = 'Fullname is required';
        return
      } else if (/\s/.test(userData.fullname)) {
        errors.fullname = 'Fullname cannot contain spaces';
        return
      }
  
     
      if (!userData.username) {
        errors.username = 'Username is required';
        return
      } else if (/\s/.test(userData.username)) {
        errors.username = 'Username cannot contain spaces';
        return
      }
  
  
      if (!userData.password) {
        errors.password = 'Password is required';
        return
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(userData.password)) {
        errors.password =
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit';
          return
      }
  
      setValidationError(errors);
  
      return Object.values(errors).every((error) => error === '');
    }
  
  const handleSignup = async (e) =>{
    e.preventDefault()
    if (validateForm){
      setError('')
      dispatch(signUpAsync(userData,navigate))
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
        {/* <a href="/auth/google" className="google-auth-link">
            <span className="google-icon"><i className="material-icons google-icon">google</i></span> Sign up with Google
          </a> */}
      </div>
      <form className='right' onSubmit={handleSignup}>
        <input type="email" placeholder='Email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })}/>
        {validationError.email && <p style={{ color: 'red' }}>{validationError.email}</p>}
        <input type="text" placeholder='Fullname' value={userData.fullname} onChange={(e) => setUserData({ ...userData, fullname: e.target.value })} />
        {validationError.fullname && <p style={{ color: 'red' }}>{validationError.fullname}</p>}
        <input type="text" placeholder='Username' value={userData.username} onChange={(e) => setUserData({...userData,username: e.target.value })}/>
        {validationError.username && <p style={{ color: 'red' }}>{validationError.username}</p>}
        <input type="password" placeholder='password' value={userData.password} onChange={(e) => setUserData({...userData,password: e.target.value })} />
        {validationError.password && <p style={{ color: 'red' }}>{validationError.password}</p>}
        {authError && <p style={{color:'red'}}>{authError}</p>}
        {/* <Link to = '/verify'> */}
          <button className='btn' type='submit'>Register</button>
        {/* </Link> */}
      </form>
    </div>
    </div>
  )
}
