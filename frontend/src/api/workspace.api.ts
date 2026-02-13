// api/workspace.api.ts
import axios from "axios";
import { getToken } from "../utils/storage";

const API_URL = "http://localhost:3000/api/v1/workspace";

export const createWorkspaceApi = async (
  name: string,
  type: string
) => {
  const token = getToken();

  const { data } = await axios.post(
    `${API_URL}/create`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const getAllWorkspacesApi = async () => {
  const token = getToken();

  const { data } = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const deleteWorkspaceApi = async (workspaceId: string) => {
  const token = getToken();

  const { data } = await axios.delete(`${API_URL}/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const joinWorkspaceApi = async (token: string) => {
  const authtoken = getToken();

  const res = await axios.post(`http://localhost:3000/api/v1/invite/accept/${token}`, {}, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });

  return res.data;
};