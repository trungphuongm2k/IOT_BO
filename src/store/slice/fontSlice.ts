import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Font } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import { uploadFileService } from '../../service';
import {
    createFontService,
    deleteFontService,
    getListFontService,
    getDetailFontService,
    updateFontService,
} from '../../service/api/fontService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllFont = createAsyncThunk('getAllFont', async (filter: FilterDto) => {
    const resData = await getListFontService(filter);
    return resData;
});

export const getDetailFont = createAsyncThunk(
    'getDetailFont',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailFont(null));
        const resData = await getDetailFontService(id);
        return resData;
    }
);

export const createFont = createAsyncThunk('createFont', async (data: any, thunkApi) => {
    const { name, fileFont, fileThumb } = data;
    const [path, thumb] = await Promise.all([
        uploadFileService('font', fileFont),
        uploadFileService('font', fileThumb),
    ]);
    const resData = await createFontService({
        name,
        path,
        thumb,
    });
    return resData;
});

export const updateFont = createAsyncThunk('updateFont', async (data: any, thunkApi) => {
    const { id, name, fileFont, fileThumb } = data;
    let path;
    let thumb;
    let updateData = {
        name: name,
    };
    if (fileFont) {
        path = await uploadFileService('font', fileFont);
        Object.assign(updateData, { path: path });
    }
    if (fileThumb) {
        thumb = await uploadFileService('font', fileThumb);
        Object.assign(updateData, { thumb: thumb });
    }
    const resData = await updateFontService(id, updateData);
    return resData;
});

export const deleteFont = createAsyncThunk('deleteFont', async (id: number | string, thunkApi) => {
    const resData = await deleteFontService(id);
    return resData;
});

export interface FontState {
    listFont: Font[];
    totalFont: number;
    detailFont: Font | null;
    loadingApiFont: boolean;
}

const initialState: FontState = {
    listFont: [] as Font[],
    totalFont: 0,
    detailFont: null,
    loadingApiFont: false,
};

export const FontSlice = createSlice({
    name: 'font',
    initialState,
    reducers: {
        setDetailFont: (state, action: PayloadAction<Font | null>) => {
            state.detailFont = action.payload;
        },
    },
    extraReducers: {
        [getAllFont.pending.toString()]: (state) => {},
        [getAllFont.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listFont = action.payload.fonts;
            state.totalFont = action.payload.total;
        },
        [getAllFont.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailFont.pending.toString()]: (state) => {
            state.loadingApiFont = true;
        },
        [getDetailFont.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailFont = action.payload;
            state.loadingApiFont = false;
        },
        [getDetailFont.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createFont.pending.toString()]: (state) => {
            state.loadingApiFont = true;
        },
        [createFont.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createFont.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateFont.pending.toString()]: (state) => {
            state.loadingApiFont = true;
        },
        [updateFont.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            notiSuccess('Cập nhật thành công.');

            state.listFont = state.listFont.map((font) => {
                if (font.id === action.payload.id) {
                    return action.payload;
                } else {
                    return font;
                }
            });
        },
        [updateFont.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteFont.pending.toString()]: (state) => {
            state.loadingApiFont = true;
        },
        [deleteFont.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            state.listFont = state.listFont.filter((font) => font.id !== action.payload.id);
            notiSuccess('Xóa thành công.');
        },
        [deleteFont.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiFont = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailFont } = FontSlice.actions;
export default FontSlice.reducer;
