import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListAudioService = async ({ page, perPage, where, select }: FilterDto) => {
    const res = await axiosClient.get('/audio', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
            select: JSON.stringify(select),
        },
    });
    return res.data;
};

export const getDetailAudioService = async (id: number | string) => {
    const res = await axiosClient.get(`/audio/${id}`);
    return res.data;
};

export const createAudioService = async (data: any) => {
    const res = await axiosClient.post('/audio', { ...data });
    return res.data;
};

export const updateAudioService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/audio/${id}`, data);
    return res.data;
};

export const deleteAudioService = async (id: number | string) => {
    const res = await axiosClient.delete(`/audio/${id}`);
    return res.data;
};
