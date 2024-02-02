import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError } from '../../Redux/Slice/authSlice';
import { verifyOtpAsync } from '../../Redux/Actions/authActions';
import './verify.css';
import axios from 'axios';


const Verification = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const authError = useSelector((state) => state.auth.error);
 const [otp, setOtp] = useState('');
 const [resendTime, setResendTime] = useState(60);
 const [canResend, setCanResend] = useState(true);
 const email = useSelector((state) => state.auth.email);

 const handleVerify = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(verifyOtpAsync(email, otp, navigate));
    setResendTime(60);
    setCanResend(false);
 };

 const handleResend = async () => {
  try {
      // Call your API to resend the OTP here
      const response = await axios.post('/resend-otp/', { email: email });
      if (response.status === 200) {
          // After successfully resending, start the countdown
          setResendTime(60);
          setCanResend(false);
      } else {
          // Handle error response
          console.log(response.data.message || 'Failed to resend OTP.');
      }
  } catch (error) {
      // Handle network error
      console.log('Network error, please try again.');
  }
};


 useEffect(() => {
    if (canResend) {
      const intervalId = setInterval(() => {
        setResendTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
 }, [canResend]);

 useEffect(() => {
    if (!canResend && resendTime === 0) {
      setCanResend(true);
    }
 }, [resendTime, canResend]);

 return (
    <div className="verification">
      <div className="card">
        <div className="left">
          <h2>-<br /> OTP Verification <br />-</h2>
          <p>Please enter the OTP sent to {email}.</p>
        </div>
        <form className='right' onSubmit={handleVerify}>
          <label htmlFor="otp">OTP:</label>
          <input type="text" name='email' value={email} readOnly />
          <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button className='btn verify-btn' type='submit'>Verify</button>
          {canResend && <button onClick={handleResend} disabled={!canResend}>Resend OTP ({resendTime})</button>}
          {authError && <p style={{ color: 'red', textAlign: 'center' }}>{authError}</p>}
        </form>
      </div>
    </div>
 );
};

export default Verification;
