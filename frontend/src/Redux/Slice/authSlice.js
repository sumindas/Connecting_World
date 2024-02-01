/* eslint-disable no-unused-expressions */
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
        allUsers : []
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
        },
        userLogout: (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
          state.login = false;
          state.token = "";
      },
      adminLogin:(state,action) => {
        state.admin_token = action.payload.jwt
      },
      adminLogout : (state) => {
        state.admin_token = " "
        state.allUsers = []
      },
      UsersList : (state,action) => {
        state.allUsers = action.data
      },
      userUpdate : (state,action) => {
          state.user.username = action.payload.username;
          state.user.location = action.payload.location;
          state.user.dateOfBirth = action.payload.dateOfBirth;
          state.user.bio = action.payload.bio;
          state.user.profileImage = action.payload.profileImage;
          state.user.coverPhoto = action.payload.coverPhoto;
      }
    },
   
})


export const {setUser,setError,clearError,setEmail,setLogin,userLogout,adminLogin,adminLogout,usersList,userUpdate} = authSlice.actions

export default authSlice.reducer