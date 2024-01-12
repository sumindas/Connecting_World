import React from 'react'
import './login.css'

function Login() {
  return (
    <div className="login">
      <div className="card">
      <div className="left">
        <h2>Connecting World <br />-</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
        <span>Don't Have an Account?</span>
        <button className='btn btn-primary'>Register</button>
      </div>
      <form className='right'>
        <input type="text" placeholder='username' />
        <input type="password" placeholder='password' />
        <button className='btn' type='submit'>Login</button>
      </form>
    </div>
    </div>
  )
}

export default Login