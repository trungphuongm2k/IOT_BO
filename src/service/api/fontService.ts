import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListFontService = async ({ page, perPage, where }: FilterDto) => {
    const res = await axiosClient.get('/font', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
        },
    });
    return res.data;
};

export const getDetailFontService = async (id: number | string) => {
    const res = await axiosClient.get(`/font/${id}`);
    return res.data;
};

export const createFontService = async (data: any) => {
    const res = await axiosClient.post('/font', { ...data });
    return res.data;
};

export const updateFontService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/font/${id}`, data);
    return res.data;
};

export const deleteFontService = async (id: number | string) => {
    const res = await axiosClient.delete(`/font/${id}`);
    return res.data;
};
