import React, { useState } from 'react';
import { UseDispatch,useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setError } from '../../Redux/Slice/authSlice';
import { verifyOtpAsync } from '../../Redux/Actions/authActions';
import './verify.css';

const Verification = ({ email }) => {
  const dispatch = useDispatch()
  const authError = useSelector((state)=>state.authError)
  const [otp, setOtp] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = async(e) => {
    e.preventDefault();
    dispatch(verifyOtpAsync({ otp }))
  }

  return (
    <div className="verification">
      <div className="card">
        <div className="left">
          <h2>-<br /> OTP Verification <br />-</h2>
          <p>Please enter the OTP sent to {email}.</p>
        </div>
        <form className='right'>
          <label htmlFor="otp">OTP:</label>
          {/* <input type="text" id = 'email' value={email} readOnly /> */}
          <input type="text" id="otp" value={otp} onChange={handleOtpChange} />
          <button className='btn' onClick={handleVerify}>Verify</button>
          {authError && <p style={{ color: 'red' }}>{authError}</p>}
        </form>
      </div>
    </div>
  );
};

export default Verification;
