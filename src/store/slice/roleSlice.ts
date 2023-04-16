import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import {
    createLanguageService,
    deleteLanguageService,
    getListLanguageService,
    getDetailLanguageService,
    updateLanguageService,
} from '../../service/api/languageService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllLanguage = createAsyncThunk('getAllLanguage', async (filter: FilterDto) => {
    const resData = await getListLanguageService(filter);
    return resData;
});

export const getDetailLanguage = createAsyncThunk(
    'getDetailLanguage',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailLanguage(null));
        const resData = await getDetailLanguageService(id);
        return resData;
    }
);

export const createLanguage = createAsyncThunk('createLanguage', async (data: any, thunkApi) => {
    const resData = await createLanguageService({
        ...data,
    });
    return resData;
});

export const updateLanguage = createAsyncThunk('updateLanguage', async (data: any, thunkApi) => {
    const { id, name, code, countryId } = data;
    const resData = await updateLanguageService(id, {
        name,
        code,
        countryId,
    });
    return resData;
});

export const deleteLanguage = createAsyncThunk(
    'deleteLanguage',
    async (id: number | string, thunkApi) => {
        const resData = await deleteLanguageService(id);
        return resData;
    }
);

export interface LanguageState {
    listLanguage: Language[];
    total: number;
    detailLanguage: Language | null;
    loadingApiLanguage: boolean;
}

const initialState: LanguageState = {
    listLanguage: [] as Language[],
    total: 0,
    detailLanguage: null,
    loadingApiLanguage: false,
};

export const LanguageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setDetailLanguage: (state, action: PayloadAction<Language | null>) => {
            state.detailLanguage = action.payload;
        },
    },
    extraReducers: {
        [getAllLanguage.pending.toString()]: (state) => {},
        [getAllLanguage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listLanguage = action.payload.languages;
            state.total = action.payload.total;
        },
        [getAllLanguage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailLanguage.pending.toString()]: (state) => {
            state.loadingApiLanguage = true;
        },
        [getDetailLanguage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailLanguage = action.payload;
            state.loadingApiLanguage = false;
        },
        [getDetailLanguage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createLanguage.pending.toString()]: (state) => {
            state.loadingApiLanguage = true;
        },
        [createLanguage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createLanguage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateLanguage.pending.toString()]: (state) => {
            state.loadingApiLanguage = true;
        },
        [updateLanguage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            notiSuccess('Cập nhật thành công.');

            state.listLanguage = state.listLanguage.map((language) => {
                if (language.id === action.payload.id) {
                    return action.payload;
                } else {
                    return language;
                }
            });
        },
        [updateLanguage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteLanguage.pending.toString()]: (state) => {
            state.loadingApiLanguage = true;
        },
        [deleteLanguage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            state.listLanguage = state.listLanguage.filter(
                (language) => language.id !== action.payload.id
            );
            notiSuccess('Xóa thành công.');
        },
        [deleteLanguage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiLanguage = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailLanguage } = LanguageSlice.actions;
export default LanguageSlice.reducer;
