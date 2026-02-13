import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:3000/api/v1/user";

export const getProfileApi = async ()=>{
    const token = getToken();

    const { data } = await axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return data;
}