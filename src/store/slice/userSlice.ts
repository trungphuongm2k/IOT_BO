import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import {
    createUserService,
    deleteUserService,
    getDetailUserService,
    getListUserService,
    updateUserService,
} from '../../service/api/userService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllUser = createAsyncThunk('getAllUser', async (filter: FilterDto) => {
    const resData = await getListUserService(filter);
    return resData;
});
export const getAllUserNotPage = createAsyncThunk(
    'getAllNoPage',
    async ({ where, select }: FilterDto) => {
        const resData = await getListUserService({ where, select });
        return resData;
    }
);

export const getDetailUser = createAsyncThunk('getDetailUser', async (id: string, thunkApi) => {
    thunkApi.dispatch(setDetailUser(null));
    const resData = await getDetailUserService(id);
    return resData;
});

export const createUser = createAsyncThunk('createUser', async (data: any, thunkApi) => {
    const resData = await createUserService(data);
    return resData;
});

export const updateUser = createAsyncThunk('updateUser', async (data: any, thunkApi) => {
    const { id } = data;
    const resData = await updateUserService(id, data);
    return resData;
});

export const deleteUser = createAsyncThunk('deleteUser', async (id: string, thunkApi) => {
    const resData = await deleteUserService(id);
    return resData;
});

export interface CateMovieState {
    listUser: User[];
    listManager: User[];
    totalUser: number;
    detailUser: User | null;
    loadingApiUser: boolean;
}

const initialState: CateMovieState = {
    listUser: [] as User[],
    totalUser: 0,
    detailUser: null,
    loadingApiUser: false,
    listManager: [],
};

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setDetailUser: (state, action: PayloadAction<User | null>) => {
            state.detailUser = action.payload;
        },
    },
    extraReducers: {
        [getAllUser.pending.toString()]: (state) => {},
        [getAllUser.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listUser = action.payload.users;
            state.totalUser = action.payload.total;
        },
        [getAllUser.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        [getAllUserNotPage.pending.toString()]: (state) => {},
        [getAllUserNotPage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listManager = action.payload.users;
            state.totalUser = action.payload.total;
        },
        [getAllUserNotPage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailUser.pending.toString()]: (state) => {
            state.loadingApiUser = true;
        },
        [getDetailUser.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailUser = action.payload;
            state.loadingApiUser = false;
        },
        [getDetailUser.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createUser.pending.toString()]: (state) => {
            state.loadingApiUser = true;
        },
        [createUser.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createUser.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateUser.pending.toString()]: (state) => {
            state.loadingApiUser = true;
        },
        [updateUser.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            notiSuccess('Cập nhật thành công.');

            state.listUser = state.listUser.map((user) => {
                if (user.id === action.payload.id) {
                    return action.payload;
                } else {
                    return user;
                }
            });
        },
        [updateUser.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteUser.pending.toString()]: (state) => {
            state.loadingApiUser = true;
        },
        [deleteUser.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            state.listUser = state.listUser.filter((user) => user.id !== action.payload.id);
            notiSuccess('Xóa thành công.');
        },
        [deleteUser.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiUser = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailUser } = UserSlice.actions;
export default UserSlice.reducer;
