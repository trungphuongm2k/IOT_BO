import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListTemplateService = async ({ page, perPage, where }: FilterDto) => {
    const res = await axiosClient.get('/template', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
        },
    });
    return res.data;
};

export const getDetailTemplateService = async (id: number | string) => {
    const res = await axiosClient.get(`/template/${id}`);
    return res.data;
};

export const createTemplateService = async (data: any) => {
    const res = await axiosClient.post('/template', data);
    return res.data;
};

export const updateTemplateService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/template/${id}`, data);
    return res.data;
};

export const deleteTemplateService = async (id: number | string) => {
    const res = await axiosClient.delete(`/template/${id}`);
    return res.data;
};
