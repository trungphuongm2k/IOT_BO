import { FilterDto } from '../../interface/filterDto';
import axiosClient from '../axiosClient';

export const getListConfigvideoService = async ({ page, perPage, where }: FilterDto) => {
    const res = await axiosClient.get('/configvideo', {
        params: {
            page: page,
            per_page: perPage,
            where: JSON.stringify(where),
        },
    });
    return res.data;
};

export const getDetailConfigvideoService = async (id: number | string) => {
    const res = await axiosClient.get(`/configvideo/${id}`);
    return res.data;
};

export const createConfigvideoService = async (data: any) => {
    const res = await axiosClient.post('/configvideo', data);
    return res.data;
};

export const updateConfigvideoService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/configvideo/${id}`, data);
    return res.data;
};

export const updateConfigvideoToolupdateService = async (id: number | string, data: any) => {
    const res = await axiosClient.patch(`/configvideo/toolupdate/${id}`, data);
    return res.data;
};

export const deleteConfigvideoService = async (id: number | string) => {
    const res = await axiosClient.delete(`/configvideo/${id}`);
    return res.data;
};

export const deleteMultipleConfigVideoService = async (ids: number[] | string[]) => {
    const res = await axiosClient.delete(`/configvideo/multiple`, {
        data: {
            ids,
        },
    });
    return res.data;
};
