import axiosClient from '../axiosClient';

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
