import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:3000/api/v1/messages";

export const deleteMessageApi = async (messageId: string) => {
    const token = getToken();

    const { data } = await axios.delete(`${API_URL}/${messageId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
