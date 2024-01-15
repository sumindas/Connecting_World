import { signUpApi,api,loginApi } from "../../Api/api";
import { setUser,setError } from "../Slice/authSlice";
import { createAsyncThunk } from '@reduxjs/toolkit'

export const signUpAsync = (userData,navigate) => async (dispatch) => {
    try{
        const response = await signUpApi(userData)
        const {email} = userData
        if (response.ok){
            dispatch(setUser(response.data.data))
            navigate(`/verify?email=${email}`)
        }
        else{
            setError(userData.error)
        }
        
    } catch(error){
        dispatch(setError(error.response.data.error));
    }
}

// export const verifyOtpAsync = (otpData,navigate) => async (dispatch) => {
//     try{
//         const response = await verifyOtpApi(otpData)
//         if (response.ok){
//             navigate('/')
//         }
//         else{
//             setError("invalid otp")
//             dispatch(setError("invalid"))
//         }
       
//     } catch(error){
//         dispatch(setError(error.response.data.error))
//     }
// }
export const verifyOtpAsync = createAsyncThunk('auth/verifyOtp', async (otpData, { dispatch }) => {
    try {
      const response = await api.verifyOtp(otpData);
      dispatch(setUser(response.data.data)); 
    } catch (error) {
      dispatch(setError(error.message || 'Error verifying OTP'));
    }
  });

export const loginAsync = (loginData, navigate) => async (dispatch) => {
    try {
      const response = await loginApi(loginData);
      dispatch(setUser(response.data.data));
      navigate('/home')
    } catch (error) {
      dispatch(setError(error.response.data.error));
    }
  };