import { createSlice } from "@reduxjs/toolkit";




const authSlice = createSlice({
    
    name :'auth',
    initialState : {
        user : null,
        isAuthenticated : false,
        error : null,
        email : "",
        isSuccess : false,
    },
    reducers :{
        setUser : (state,action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.error = null
        },
        setError : (state,action)=>{
            state.error = action.payload
            state.isAuthenticated = false
        },
        clearError :(state) => {
          state.error = null
        },
        setEmail :(state,action) => {
          state.email = action.payload
        },
        otpVerificationSuccess: (state, action) => {
          state.isSuccess = action.payload;
        },
    },
   
})


export const {setUser,setError,clearError,setEmail,isSuccess} = authSlice.actions

export default authSlice.reducer