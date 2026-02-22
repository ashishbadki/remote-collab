import axios from "axios";
import { getToken } from "../utils/storage";
import { ENDPOINTS } from "../constants/endpoints";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createWorkspaceApi = async (
  name: string,
  type: string
) => {
  const token = getToken();

  const { data } = await axios.post(
    `${API_BASE_URL}${ENDPOINTS.WORKSPACE.CREATE}`,
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

  const { data } = await axios.get(`${API_BASE_URL}${ENDPOINTS.WORKSPACE.MY_WORKSPACES}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const deleteWorkspaceApi = async (workspaceId: string) => {
  const token = getToken();

  const { data } = await axios.delete(`${API_BASE_URL}${ENDPOINTS.WORKSPACE.BY_ID(workspaceId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const joinWorkspaceApi = async (token: string) => {
  const authtoken = getToken();

  const res = await axios.post(`${API_BASE_URL}${ENDPOINTS.INVITE.ACCEPT(token)}`, {}, {
    headers: {
      Authorization: `Bearer ${authtoken}`,
    },
  });

  return res.data;
};

export const getWorkspaceByIdApi = async (workspaceId: string) => {
  const token = getToken();

  const { data } = await axios.get(`${API_BASE_URL}${ENDPOINTS.WORKSPACE.BY_ID(workspaceId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};