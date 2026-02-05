import axios  from "axios"
import { getToken } from "../utils/storage" 

const API_URL = "http://localhost:3000/api/v1/workspace";

export const workspaceApi = async (name: string, type: string)=>{
    const token = getToken();
    const res = await axios.post(`${API_URL}/create`, {
        name,
        type
    },
    {
        headers:{
            Authorization: `Bearer ${token}`,
        },
    }
);
    return res.data;
}