import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListImageService = async ({ page, perPage, where }: FilterDto) => {
    const res = await axiosClient.get('/image', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
        },
    });
    return res.data;
};

export const getDetailImageService = async (id: number | string) => {
    const res = await axiosClient.get(`/image/${id}`);
    return res.data;
};

export const createImageService = async (data: any) => {
    const res = await axiosClient.post('/image', { ...data });
    return res.data;
};

export const updateImageService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/image/${id}`, data);
    return res.data;
};

export const deleteImageService = async (id: number | string) => {
    const res = await axiosClient.delete(`/image/${id}`);
    return res.data;
};
