import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:3000/api/v1/channel";

export const getChannelsByWorkspaceApi = async (workspaceId: string) => {
    const token = getToken();

    const { data } = await axios.get(`${API_URL}/workspace/${workspaceId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};

export const createChannelApi = async (workspaceId: string, name: string) => {
    const token = getToken();

    const { data } = await axios.post(
        `${API_URL}/create/${workspaceId}`,
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

    const { data } = await axios.delete(`${API_URL}/delete/${channelId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
