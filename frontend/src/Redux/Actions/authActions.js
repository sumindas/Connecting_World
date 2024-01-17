import { signUpApi,loginApi } from "../../Api/api";
import { setUser,setError } from "../Slice/authSlice";


export const signUpAsync = (userData,navigate) => async (dispatch) => {
    try{
        const response = await signUpApi(userData)
        console.log(response)
        if (response.status === 200){
            console.log("User Created Successfully")
            dispatch(setUser(response.data.data))
            navigate('/verify')
        }
        else{
          console.log('Error during user creation:', response.data.error)
          dispatch(setError(response.data.error))
        }
        
    } catch(error){
      console.log('Error during user creation:', error.response?.data?.message || 'Unknown error occurred');
      dispatch(setError(error.response?.data?.message))
    }
}



export const loginAsync = (loginData, navigate) => async (dispatch) => {
    try {
      const response = await loginApi(loginData);
      dispatch(setUser(response.data.data));
      navigate('/home')
    } catch (error) {
      dispatch(setError(error.response.data.error));
    }
  };