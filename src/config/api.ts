const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login`,
        ME: `${BASE_URL}/auth/me`,
    },

    USERS: {
        GET_ALL: `${BASE_URL}/users`,
        GET_BY_ID: (id: string | number) => `${BASE_URL}/users/${id}`,
        GET_BY_PID: (pid: string) => `${BASE_URL}/users/pid/${pid}`,
        UPDATE: (id: string | number) => `${BASE_URL}/users/${id}`,
        DELETE: (id: string | number) => `${BASE_URL}/users/${id}`,
    },

    ACCESS_LOGS: {
        GET_ALL: `${BASE_URL}/access-logs`,
        SUMMARY: `${BASE_URL}/access-logs/summary`,
        PROCESS: `${BASE_URL}/access-logs/process`,
        MANUAL: `${BASE_URL}/access-logs/manual`,
    },
};