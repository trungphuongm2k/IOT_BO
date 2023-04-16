import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListTopicService = async ({ page, perPage, where, select }: FilterDto) => {
    const res = await axiosClient.get('/topic', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
            select: JSON.stringify(select),
        },
    });
    return res.data;
};

export const getDetailTopicService = async (id: number | string) => {
    const res = await axiosClient.get(`/topic/${id}`);
    return res.data;
};

export const createTopicService = async (data: any) => {
    const res = await axiosClient.post('/topic', { ...data });
    return res.data;
};

export const updateTopicService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/topic/${id}`, data);
    return res.data;
};

export const deleteTopicService = async (id: number | string) => {
    const res = await axiosClient.delete(`/topic/${id}`);
    return res.data;
};
