import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListLanguageService = async ({ page, perPage, where, select }: FilterDto) => {
    const res = await axiosClient.get('/language', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
            select: JSON.stringify(select),
        },
    });
    return res.data;
};

export const getDetailLanguageService = async (id: number | string) => {
    const res = await axiosClient.get(`/language/${id}`);
    return res.data;
};

export const createLanguageService = async (data: any) => {
    const res = await axiosClient.post('/language', { ...data });
    return res.data;
};

export const updateLanguageService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/language/${id}`, data);
    return res.data;
};

export const deleteLanguageService = async (id: number | string) => {
    const res = await axiosClient.delete(`/language/${id}`);
    return res.data;
};
