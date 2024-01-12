import React from 'react'
import './signup.css'
import { Link } from 'react-router-dom'

export const SignUp = () => {
  return (
    <div className="signup">
      <div className="card">
      <div className="left">
        <h2>-<br /> Connecting World SignUp <br />-</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet . </p>
        <span>Have an Account?</span>
        <Link to = '/login'>
        <button className='btn btn-primary'>Login</button>
        </Link>
        {/* <a href="/auth/google" className="google-auth-link">
            <span className="google-icon"><i className="material-icons google-icon">google</i></span> Sign up with Google
          </a> */}
      </div>
      <form className='right'>
        <input type="email" placeholder='Email' />
        <input type="text" placeholder='Fullname' />
        <input type="text" placeholder='Username' />
        <input type="password" placeholder='password' />
        <button className='btn' type='submit'>Register</button>
      </form>
    </div>
    </div>
  )
}
