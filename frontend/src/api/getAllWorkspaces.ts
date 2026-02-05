import axios from "axios"

import { getToken } from "../utils/storage" 

const API_URL = "http://localhost:3000/api/v1/workspace";

export const getAllWorkspaceApi = async ()=>{
    const token = getToken();

    const res = await axios.get(`${API_URL}/my`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data;
}