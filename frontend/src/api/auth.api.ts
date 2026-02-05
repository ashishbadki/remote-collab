import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

export const SignupApi = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try{
    const res = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      confirmPassword,
    });

    return res.data;
  } 
  catch (error: any){
    throw error;
  }
};


export const LoginApi = async (email: string, password: string) =>{
    const res = await axios.post(`${API_URL}/login`,{
        email,
        password
    })
    return res.data;

}