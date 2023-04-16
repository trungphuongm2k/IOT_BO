export const getStoreLocal = (item: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(item) as string;
    }
};
export const removeStoreLocal = (item: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.removeItem(item);
    }
};
export const setStoreLocal = (item: string, token: string) => {
    if (typeof window !== 'undefined') {
        return localStorage.setItem(item, token);
    }
};

export const saveToken = (resData: any) => {
    const { access_token, expires_in, refresh_expires_in, refresh_token } = resData;
    setStoreLocal('access_token', access_token);
    setStoreLocal('refresh_token', refresh_token);
    const timeAccess = Date.now() + parseInt(expires_in) * 1000;
    const timeRefresh = Date.now() + parseInt(refresh_expires_in) * 1000;
    setStoreLocal('time_access', timeAccess.toString());
    setStoreLocal('time_refresh', timeRefresh.toString());
};

export const checlToken = () => {
    const access_token = getStoreLocal('access_token');
    const time_access = getStoreLocal('time_access');
    const refresh_token = getStoreLocal('refresh_token');
    const time_refresh = getStoreLocal('time_refresh');
    if (!access_token || !time_access || !refresh_token || !time_refresh) return 'NO_TOKEN';
    if (parseInt(time_access) < Date.now()) {
        if (parseInt(time_refresh) < Date.now()) return 'EXPIRED_REFRESH_TOKEN';
        return 'EXPIRED_ACCESS_TOKEN';
    } else {
        return 'TOKEN_VALID';
    }
};
