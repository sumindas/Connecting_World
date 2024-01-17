import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError, setEmail, setError, setUser } from '../../Redux/Slice/authSlice';
import { api } from '../../Api/api';
import './verify.css';

const Verification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((state) => state.authError);
  const [otp, setOtp] = useState('');
  const email = useSelector((state) => state.auth.email);

  

  const handleVerify = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    try{
      const response = await api.verifyOtp(email,otp)
      console.log('Api Response:',response)

      if(response.status === 200){
        dispatch(setUser)
        navigate('/')
      }else{
        dispatch(setError(response.data.error || 'Error Verifying Otp'))
      }
    } catch(error){
      dispatch(setError(error.message || 'Invalid Otp'))
    }
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
          <button className='btn' type='submit' >Verify</button>
          {authError && <p style={{ color: 'red' }}>{authError}</p>}
        </form>
      </div>
    </div>
  );
};

export default Verification;
