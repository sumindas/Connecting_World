import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    
    name :'auth',
    initialState : {
        user : null,
        error : null,
        email : "",
        login : false,
        token : "",
        admin_token : "",
    },
    reducers :{
        setUser : (state,action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.error = null
        },
        setError : (state,action)=>{
            console.log("Error:",action.payload)
            state.error = action.payload
        },
        clearError :(state) => {                                                                       
          state.error = null
        },
        setEmail :(state,action) => {
          state.email = action.payload
        },
        setLogin : (state,action) => {
          state.user = action.payload.user
          state.login = true
          state.token = action.payload.jwt
        }
    },
   
})


export const {setUser,setError,clearError,setEmail,setLogin} = authSlice.actions

export default authSlice.reducer