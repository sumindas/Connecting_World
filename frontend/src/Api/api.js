import axios from "axios";


export const BASE_URL = 'http://127.0.0.1:8000'

export const signUpApi = (userData) => axios.post(`${BASE_URL}/signup/`,userData)

export const verifyOtp = (email,otp) => axios.post(`${BASE_URL}/verify_otp/`, {email,otp})

export const loginApi = (email,password) => axios.post(`${BASE_URL}/login/`,{email,password})

export const userProfileApi = (userId) => axios.get(`${BASE_URL}/userdata/${userId}`)

export const logoutApi = () => axios.post(`${BASE_URL}/logout/`)






