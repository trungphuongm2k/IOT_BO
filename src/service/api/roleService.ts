import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListRoleService = async ({ page, perPage, where }: FilterDto) => {
    const res = await axiosClient.get('/role', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
        },
    });
    return res.data;
};

export const getDetailRoleService = async (id: number | string) => {
    const res = await axiosClient.get(`/role/${id}`);
    return res.data;
};

export const createRoleService = async (data: any) => {
    const res = await axiosClient.post('/role', { ...data });
    return res.data;
};

export const updateRoleService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/role/${id}`, data);
    return res.data;
};

export const deleteRoleService = async (id: number | string) => {
    const res = await axiosClient.delete(`/role/${id}`);
    return res.data;
};
