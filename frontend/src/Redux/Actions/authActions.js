import { loginApi, signUpApi, verifyOtp } from "../../Api/api";
import { setUser,setError,clearError,setToken } from "../Slice/authSlice";


export const signUpAsync = (userData,navigate) => async (dispatch) => {
    try{
        const response = await signUpApi(userData)
        console.log("Api Response:",response)
        if (response.data.error){
          dispatch(setError(response.data.error))
        }
        else if (response.status >= 200 && response.status <300){
            console.log("User Created Successfully")
            dispatch(setUser(response.data.data))
            navigate('/verify')
        }
        else{
          dispatch(setError(response.data.error));
        }
        
    } catch(error){
      console.log('Error during user creation:', error );
      console.log("Error Response:",error.response)
      console.log("Error Response data:",error.response.data.error)
      dispatch(setError(error.response.data.error))

    }
}


export const verifyOtpAsync = (email,otp,navigate) => async (dispatch) => {
  try{
    const response = await verifyOtp(email,otp)
    console.log("APi Response:",response)
    if (response.status === 200){
      dispatch(setUser(response.data.user))
      navigate('/')
    } else {
      dispatch(setError(response.data.error))
    }
  } catch(error){
    console.log("Errors:",error)
    dispatch(setError(error.response.data.error))
  }
}

export const login = (email,password,navigate) => async (dispatch) =>{
  try{
    const response = await loginApi(email,password)
    console.log(response)
    if(response.status === 200){
      dispatch(setUser(response.data.data))
      dispatch(setToken(response.data.jwt))
      dispatch(clearError())
      navigate('/home')
    }
    else{
      dispatch(setError("invalid details"))
    }
  }catch(error){
    console.log("An Error Occured:",error)
    dispatch(setError("Invalid details"))
  }
}


