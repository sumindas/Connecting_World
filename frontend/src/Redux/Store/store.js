import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Slice/authSlice";
import profileSlice from "../Slice/profileSlice";


const store = configureStore({
    reducer:{
        auth:authSlice,
        profile:profileSlice,
    }
})

export default store