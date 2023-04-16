import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListChannelService = async ({ page, perPage, where, select }: FilterDto) => {
    const res = await axiosClient.get('/channel', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
            select: JSON.stringify(select),
        },
    });
    return res.data;
};

export const getDetailChannelService = async (id: number | string) => {
    const res = await axiosClient.get(`/channel/${id}`);
    return res.data;
};

export const createChannelService = async (data: any) => {
    const res = await axiosClient.post('/channel', { ...data });
    return res.data;
};

export const updateChannelService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/channel/${id}`, data);
    return res.data;
};

export const deleteChannelService = async (id: number | string) => {
    const res = await axiosClient.delete(`/channel/${id}`);
    return res.data;
};
