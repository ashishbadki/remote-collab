import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:3000/api/v1/workspace";

export const deleteWorkspaceApi = async (workspaceId: string) => {
  const token = getToken();

  const res = await axios.delete(`${API_URL}/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
