import axios from "axios";
import { getToken } from "../utils/storage";
import { ENDPOINTS } from "../constants/endpoints";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getChannelsByWorkspaceApi = async (workspaceId: string) => {
    const token = getToken();

    const { data } = await axios.get(`${API_BASE_URL}${ENDPOINTS.CHANNEL.BY_WORKSPACE(workspaceId)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const createChannelApi = async (workspaceId: string, name: string) => {
    const token = getToken();

    const { data } = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.CHANNEL.CREATE(workspaceId)}`,
        { name },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return data;
};

export const deleteChannelApi = async (channelId: string) => {
    const token = getToken();

    const { data } = await axios.delete(`${API_BASE_URL}${ENDPOINTS.CHANNEL.DELETE(channelId)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
