import axios from "axios";


const BASE_URL = 'http://127.0.0.1:8000'

export const signUpApi = (userData) => axios.post(`${BASE_URL}/signup/`,userData)
export const api = {
    verifyOtp: async (email,otp) => {
      try {
        const response = await axios.post(`${BASE_URL}/verify_otp/`, {email,otp});
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    },
  }
export const loginApi = (userData) => axios.post(`${BASE_URL}/login/`,userData)