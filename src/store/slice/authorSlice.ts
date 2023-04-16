import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModelObject, Permission, Role } from '../../interface';
import {
    getAllModelObjectService,
    getAllPermissonService,
    getRoleService,
    RolePermissionDto,
    updateRoleService,
} from '../../service/api/authorService';
import { createRoleService, getDetailRoleService } from '../../service/api/roleService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllRole = createAsyncThunk('getRole', async () => {
    const resData = await getRoleService();
    return resData;
});

export const getDetailRole = createAsyncThunk('getDetailRole', async (id: string, thunkApi) => {
    thunkApi.dispatch(setDetailRole(null));
    const resData = await getDetailRoleService(id);
    return resData;
});

export const getAllPermission = createAsyncThunk('getAllPermission', async (thunkApi) => {
    const resData = await getAllPermissonService();

    return resData;
});
export const getAllModelObject = createAsyncThunk('getAllObject', async (thunkApi) => {
    const resData = await getAllModelObjectService();

    return resData;
});
export const updateRole = createAsyncThunk(
    'updateRolePermission',
    async (data: RolePermissionDto, thunkApi) => {
        const id = data.id as string;
        delete data.id;
        console.log(data, 'data');
        const resData = await updateRoleService(id, data);
        return resData;
    }
);
export const createRole = createAsyncThunk(
    'createRolePermission',
    async (data: RolePermissionDto, thunkApi) => {
        const resData = await createRoleService(data);
        return resData;
    }
);
export interface RoleState {
    listRole: Role[];
    listAllpermision: string[];
    listModel: ModelObject[];
    // totalUser: number;
    detailRole: Role | null;
    listperofrole: string[];
    loadingApiRole: boolean;
}

const initialState: RoleState = {
    listRole: [] as Role[],
    listperofrole: [] as string[],
    listAllpermision: [] as string[],
    listModel: [] as ModelObject[],
    detailRole: null,
    loadingApiRole: false,
};

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setDetailRole: (state, action: PayloadAction<Role | null>) => {
            state.detailRole = action.payload;
        },
    },
    extraReducers: {
        [getAllRole.pending.toString()]: (state) => {},
        [getAllRole.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listRole = action.payload.roles;
        },
        [getAllRole.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },

        //////////////////////////////////////////////////////////////////

        [getAllPermission.pending.toString()]: (state) => {},
        [getAllPermission.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listAllpermision = action.payload.permissions.map((item: any) => {
                return item.id;
            });
        },
        [getAllPermission.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////

        [getAllModelObject.pending.toString()]: (state) => {},
        [getAllModelObject.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listModel = action.payload.modelObject;
        },
        [getAllModelObject.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },

        //////////////////////////////////////////////////////////////////
        [getDetailRole.pending.toString()]: (state) => {
            state.loadingApiRole = true;
        },
        [getDetailRole.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailRole = action.payload.role;
            state.listperofrole = action.payload.listPer;
            state.loadingApiRole = false;
        },
        //////////////////////////////////////////////////////////////////

        [updateRole.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiRole = false;
            notiError('Lỗi.');
        },
        [updateRole.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            notiSuccess('Cập nhật thành công.');
            state.detailRole = action.payload.role;
            state.listperofrole = action.payload.listPer;
            state.loadingApiRole = false;
        },
        [updateRole.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiRole = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////

        [createRole.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiRole = false;
            notiError('Lỗi.');
        },
        [createRole.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            notiSuccess('Thêm bản ghi thành công!!!');
            state.loadingApiRole = false;
        },
        [createRole.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiRole = false;
            notiError('Lỗi.');
        },

        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailRole } = roleSlice.actions;
export default roleSlice.reducer;
