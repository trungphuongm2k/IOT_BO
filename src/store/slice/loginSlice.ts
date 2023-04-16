import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stat } from 'fs';
import jwt_decode from 'jwt-decode';
import { Decode, Role, User } from '../../interface';
import {
    changePasswordService,
    checkMeService,
    loginService,
    logoutService,
    refreshToken,
} from '../../service/api/loginService';
import { getStoreLocal, removeStoreLocal, saveToken } from '../../utils/localStore';
import { notiError, notiSuccess } from '../../utils/notification';

export const checkMe = createAsyncThunk(
    'checkMe',
    async (
        data: {
            type: number;
            redirectUri: string;
        },
        thunkAPI
    ) => {
        const access_token = getStoreLocal('access_token');
        const time_access = getStoreLocal('time_access');
        const refresh_token = getStoreLocal('refresh_token');
        const time_refresh = getStoreLocal('time_refresh');
        if (!access_token || !time_access || !refresh_token || !time_refresh)
            return thunkAPI.rejectWithValue('Không thấy access token');
        let decoded;
        if (parseInt(time_access) < Date.now()) {
            if (parseInt(time_refresh) < Date.now())
                return thunkAPI.rejectWithValue('Refresh Token hết hạn');
            const resNewToken = await refreshToken(refresh_token, data.redirectUri);
            decoded = jwt_decode<Decode>(resNewToken.access_token);
        } else {
            decoded = jwt_decode<Decode>(access_token);
        }
        const resData = await checkMeService(decoded.sub as string);
        return resData;
    }
);

export const login = createAsyncThunk(
    'login',
    async (
        data: {
            code: string;
            redirectUri: string;
        },
        thunkAPI
    ) => {
        const { code, redirectUri } = data;
        const resData = await loginService({ code, redirectUri });
        return resData;
    }
);

export const logout = createAsyncThunk(
    'logout',
    async (
        data: {
            refreshToken: string;
        },
        thunkAPI
    ) => {
        const { refreshToken } = data;
        const resData = await logoutService({ refreshToken });
        return resData;
    }
);

export const changePassword = createAsyncThunk('changePassword', async (data: any, thunkAPI) => {
    const { id, password } = data;
    const resData = await changePasswordService(id, { password });
    return resData;
});
export interface LoginState {
    isLogin: boolean;
    user: User | null;
    loading: boolean;
    role?: string[];
}

const initialState: LoginState = {
    isLogin: false,
    user: null,
    loading: false,
    role: [],
};

export const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logOut: (state) => {
            removeStoreLocal('access_token');
            removeStoreLocal('refresh_token');
            removeStoreLocal('time_refresh');
            removeStoreLocal('time_access');
            removeStoreLocal('keycloakId');
            state.isLogin = false;
            state.user = null;
        },
    },
    extraReducers: {
        [checkMe.pending.toString()]: (state) => {
            state.loading = true;
        },
        [checkMe.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.user = action.payload;
            state.role = action.payload?.role.map((item: Role) => item.name);
            state.isLogin = true;
        },
        [checkMe.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loading = false;
        },
        //////////////////////////////////////////////////////////////////
        [login.pending.toString()]: (state) => {},
        [login.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            saveToken(action.payload);
        },
        [login.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Đăng nhập thất bại.');
        },
        //////////////////////////////////////////////////////////////////
        [logout.pending.toString()]: (state) => {},
        [logout.fulfilled.toString()]: (state, action: PayloadAction<any>) => {},
        [logout.rejected.toString()]: (state, action: PayloadAction<any>) => {},

        //////////////////////////////////////////////////////////////////
        [changePassword.pending.toString()]: (state) => {},
        [changePassword.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            notiSuccess('Đổi mật khẩu thành công');
        },
        [changePassword.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Đổi mật khẩu thất bại.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { logOut } = LoginSlice.actions;
export default LoginSlice.reducer;
