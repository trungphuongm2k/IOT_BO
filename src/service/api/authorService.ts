import axiosClient from '../axiosClient';

export interface RolePermissionDto {
    id?: string;
    name?: string;
    listpermissionId?: string[];
}

export const getRoleService = async () => {
    const res = await axiosClient.get('/role');
    return res.data;
};
export const getDetailRoleService = async (id: string) => {
    const res = await axiosClient.get(`/role/${id}`);
    return res.data;
};
export const updateRoleService = async (id: string, data: RolePermissionDto) => {
    const res = await axiosClient.patch(`/role/${id}`, data);
    return res.data;
};
export const getAllPermissonService = async () => {
    const res = await axiosClient.get('/permission');

    return res.data;
};
export const getAllModelObjectService = async () => {
    const res = await axiosClient.get('/modelObject');

    return res.data;
};
