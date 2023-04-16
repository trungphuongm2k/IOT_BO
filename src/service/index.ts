import axios from 'axios';
import { getStoreLocal } from '../utils/localStore';
import axiosClient from './axiosClient';

export const uploadFileService = async (container: string, fileData: any) => {
    const formData = new FormData();
    formData.append('file', fileData);
    const res = await axiosClient.post(`container/${container}/uploads`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const uploadBigFileService = async (fileData: any) => {
    const formData = new FormData();
    formData.append('file', fileData);
    const res = await axiosClient.post(`/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};

export const uploadGstorageService = async (fileData: any) => {
    const formData = new FormData();
    formData.append('file', fileData);
    const res = await axiosClient.post(`/gstorage/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
};
