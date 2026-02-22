export const ENDPOINTS = {
    AUTH: {
        SIGNUP: '/auth/signup',
        LOGIN: '/auth/login',
    },
    USER: {
        PROFILE: '/user/profile',
    },
    WORKSPACE: {
        CREATE: '/workspace/create',
        MY_WORKSPACES: '/workspace/my',
        BY_ID: (id: string) => `/workspace/${id}`,
    },
    CHANNEL: {
        BY_WORKSPACE: (workspaceId: string) => `/channel/workspace/${workspaceId}`,
        CREATE: (workspaceId: string) => `/channel/create/${workspaceId}`,
        DELETE: (channelId: string) => `/channel/delete/${channelId}`,
    },
    MESSAGE: {
        DELETE: (messageId: string) => `/messages/${messageId}`,
        FOR_CHANNEL: (channelId: string) => `/messages/${channelId}`,
    },
    INVITE: {
        ACCEPT: (token: string) => `/invite/accept/${token}`,
        GENERATE: (workspaceId: string) => `/invite/${workspaceId}`,
    },
};
