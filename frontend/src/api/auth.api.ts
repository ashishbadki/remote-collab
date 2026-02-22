import axios from "axios";
import { ENDPOINTS } from "../constants/endpoints";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const SignupApi = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.SIGNUP}`, {
      name,
      email,
      password,
      confirmPassword,
    });

    return data;
  }
  catch (error: any) {
    throw error;
  }
};


export const LoginApi = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`, {
    email,
    password
  })
  return data;

}