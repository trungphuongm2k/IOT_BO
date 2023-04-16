import { ResetPassword } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListUserService = async ({ page, perPage, where, select }: FilterDto) => {
    const res = await axiosClient.get('/user', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
            select: JSON.stringify(select),
        },
    });
    return res.data;
};
export const resetPasswordService = async (data: ResetPassword) => {
    await axiosClient.post(`/user/resetpassword`, data);
};

export const getDetailUserService = async (id: string) => {
    const res = await axiosClient.get(`/user/${id}`, {
        params: {
            id,
        },
    });
    return res.data;
};

export const createUserService = async (data: any) => {
    const res = await axiosClient.post('/user', { ...data });
    return res.data;
};

export const updateUserService = async (id: string, data: any) => {
    delete data.id;
    const res = await axiosClient.patch(`/user/${id}`, data);
    return res.data;
};

export const deleteUserService = async (id: string) => {
    const res = await axiosClient.delete(`/user/${id}`);
    return res.data;
};
