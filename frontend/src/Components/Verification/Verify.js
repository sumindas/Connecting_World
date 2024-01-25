import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError } from '../../Redux/Slice/authSlice';
import './verify.css';
import { verifyOtpAsync } from '../../Redux/Actions/authActions';

const Verification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.auth.error);
  const [otp, setOtp] = useState('');
  const email = useSelector((state) => state.auth.email);

  

  const handleVerify = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(verifyOtpAsync(email,otp,navigate))
  };

  return (
    <div className="verification">
      <div className="card">
        <div className="left">
          <h2>-<br /> OTP Verification <br />-</h2>
          <p>Please enter the OTP sent to {email}.</p>
        </div>
        <form className='right'onSubmit={handleVerify}>
          <label htmlFor="otp">OTP:</label>
          <input type="text" name='email' value={email} readOnly />
          <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button className='btn verify-btn' type='submit' >Verify</button>
          {authError && <p style={{ color: 'red',textAlign:'center' }}>{authError}</p>}
        </form>
      </div>
    </div>
  );
};

export default Verification;
