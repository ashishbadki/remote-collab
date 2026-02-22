import axios from "axios";
import { getToken } from "../utils/storage";
import { ENDPOINTS } from "../constants/endpoints";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteMessageApi = async (messageId: string) => {
    const token = getToken();

    const { data } = await axios.delete(`${API_BASE_URL}${ENDPOINTS.MESSAGE.DELETE(messageId)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const getMessagesByChannelApi = async (channelId: string) => {
    const token = getToken();

    const { data } = await axios.get(`${API_BASE_URL}${ENDPOINTS.MESSAGE.FOR_CHANNEL(channelId)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
