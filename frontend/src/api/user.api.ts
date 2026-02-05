import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:3000/api/v1/auth";

export const getProfileApi = async ()=>{
    const token = getToken();

    const res = await axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}