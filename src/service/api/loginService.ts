import { saveToken } from '../../utils/localStore';
import axiosClient from '../axiosClient';

export const getLoginLink = async (redirectUri: string) => {
    const res = await axiosClient.get('/auth/login-link', {
        params: {
            redirect_uri: redirectUri,
        },
    });
    return res.data;
};

export const refreshToken = async (refreshToken: string, redirectUri: string) => {
    const res = await axiosClient.post('/auth/refresh-token', {
        refreshToken: refreshToken,
        redirectUri: redirectUri,
    });
    saveToken(res.data);
    return res.data;
};

export const checkMeService = async (userId: string) => {
    const res = await axiosClient.get('/user/checkme', {
        params: {
            id: userId,
        },
    });
    return res.data;
};

export const loginService = async (data: any) => {
    const res = await axiosClient.post('/auth/verify', data);
    return res.data;
};

export const logoutService = async (data: any) => {
    const res = await axiosClient.post('/auth/logout', data);
    return res.data;
};

export const changePasswordService = async (id: string, data: any) => {
    const res = await axiosClient.patch(`/user/${id}`, data);
};
