import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListCountryService = async ({ page, perPage, where }: FilterDto) => {
    const res = await axiosClient.get('/device', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
        },
    });
    return res.data;
};

export const getDetailCountryService = async (id: number | string) => {
    const res = await axiosClient.get(`/country/${id}`);
    return res.data;
};

export const createCountryService = async (data: any) => {
    const res = await axiosClient.post('/country', { ...data });
    return res.data;
};

export const updateCountryService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/country/${id}`, data);
    return res.data;
};

export const deleteCountryService = async (id: number | string) => {
    const res = await axiosClient.delete(`/country/${id}`);
    return res.data;
};
