import axios, { AxiosRequestConfig } from 'axios';
import { useAppDispatch } from '../store/hooks';
import { checlToken } from '../utils/localStore';
import { notiWarning } from '../utils/notification';
import { refreshToken } from './api/loginService';

const getStoreLocal = (item: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(item);
    }
};

const axiosClient = axios.create({
    baseURL: process.env.HOST_NAME_API,
    headers: {
        accept: 'application/json',
    },
});

const urlCheck = ['/auth/verify', '/auth/refresh-token', '/auth/logout', '/auth/login-link'];

const onRequest = async (config: AxiosRequestConfig) => {
    const token = getStoreLocal('access_token') as string;
    config.headers = {
        Authorization: ` Bearer ${token}`,
    };
    if (urlCheck.includes(config.url as string)) return config;
    const status = checlToken();
    if (status === 'TOKEN_VALID') return config;
    if (status === 'EXPIRED_ACCESS_TOKEN') {
        const refresh = getStoreLocal('refresh-token') as string;
        await refreshToken(refresh, process.env.HOST_NAME_REDIRECT as string);
        return config;
    }
    if (status === 'EXPIRED_REFRESH_TOKEN') {
        notiWarning('Đăng nhập lại ứng dụng !!!');
        return Promise.reject('Phiên đăng nhập hết hạn');
    }
    return Promise.reject('Phiên đăng nhập hết hạn');
};

const onError = (error: any) => {
    return Promise.reject(error);
};

axiosClient.interceptors.request.use(onRequest, onError);

export default axiosClient;
