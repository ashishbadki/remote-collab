import axios from "axios";
import { getToken } from "../utils/storage";
import { ENDPOINTS } from "../constants/endpoints";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const generateInviteApi = async (workspaceId: string) => {
    const token = getToken();

    const { data } = await axios.post(`${API_BASE_URL}${ENDPOINTS.INVITE.GENERATE(workspaceId)}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return data;
};
