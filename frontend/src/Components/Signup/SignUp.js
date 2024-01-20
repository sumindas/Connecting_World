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
  console.log(authError)

  const handleGoogleLogin = async(response) =>{
   console.log("Please Wait")
  }
  
   
  
  const handleSignup = async (e) =>{
    e.preventDefault()
        dispatch(signUpAsync(userData,navigate))
        dispatch(setEmail(userData.email))
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
        <input type="text" placeholder='Fullname' value={userData.full_name} onChange={(e) => setUserData({ ...userData, full_name: e.target.value })} />  
        <input type="text" placeholder='Username' value={userData.username} onChange={(e) => setUserData({...userData,username: e.target.value })}/>  
        <input type="password" placeholder='password' value={userData.password} onChange={(e) => setUserData({...userData,password: e.target.value })} /> 
        {authError && <p style={{color:'red',textAlign:'center'}}>{authError}</p>}
          <button className='btn' type='submit'>Register</button>
          <GoogleLogin className="google-btn"
            clientId="73138496489-tsat7qgnlonvdj9gmlrd3nia5b5b1e0l.apps.googleusercontent.com"
            buttonText="SignUp with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleLogin}
            cookiePolicy={'single_host_origin'}
          />
      </form>
    </div>
    </div>
  )
}
