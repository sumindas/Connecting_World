import { createSlice } from "@reduxjs/toolkit";
import { verifyOtpAsync } from "../Actions/authActions";


const authSlice = createSlice({
    name :'auth',
    initialState : {
        user : null,
        isAuthenticated : false,
        error : null,
    },
    reducers :{
        setUser : (state,action) => {
            state.user = action.payload
            state.isAuthenticated = !! action.payload
            state.error = null
        },
        setError : (state,action)=>{
            state.error = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(verifyOtpAsync.fulfilled, (state, action) => {
          // Handle successful OTP verification
        });
        builder.addCase(verifyOtpAsync.rejected, (state, action) => {
          // Handle rejected OTP verification
        });
      },
})


export const {setUser,setError} = authSlice.actions

export default authSlice.reducer