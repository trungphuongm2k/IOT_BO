import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Configvideo } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import { uploadFileService, uploadGstorageService } from '../../service';
import {
    createConfigvideoService,
    deleteConfigvideoService,
    getListConfigvideoService,
    getDetailConfigvideoService,
    updateConfigvideoService,
    deleteMultipleConfigVideoService,
    updateConfigvideoToolupdateService,
} from '../../service/api/configvideoService';

import { notiError, notiSuccess } from '../../utils/notification';
import { StatusVideo } from '../../interface/enum';

export const getAllConfigvideo = createAsyncThunk(
    'getAllConfigvideo',
    async (filter: FilterDto) => {
        const resData = await getListConfigvideoService(filter);
        return resData;
    }
);

export const getDetailConfigvideo = createAsyncThunk(
    'getDetailConfigvideo',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailConfigvideo(null));
        const resData = await getDetailConfigvideoService(id);
        return resData;
    }
);

export const createConfigvideo = createAsyncThunk(
    'createConfigvideo',
    async (data: any, thunkApi) => {
        const { fileConfigvideo, fileThumb } = data;
        const pathFileConfig = await uploadGstorageService(fileConfigvideo);
        const thumb = await uploadFileService('configvideo', fileThumb);
        data.fileConfigvideo = undefined;
        data.fileThumb = undefined;
        const resData = await createConfigvideoService({
            ...data,
            pathFileConfig,
            thumb,
        });
        return resData;
    }
);

export const updateConfigvideo = createAsyncThunk(
    'updateConfigvideo',
    async (data: any, thunkApi) => {
        const { id, fileThumb } = data;
        data.id = undefined;
        let thumb;
        if (fileThumb) {
            thumb = await uploadFileService('configvideo', fileThumb);
            data.thumb = thumb;
        }
        data.fileConfigvideo = undefined;
        data.fileThumb = undefined;

        const resData = await updateConfigvideoService(id, data);
        return resData;
    }
);

export const reuploadConfigvideo = createAsyncThunk(
    'reuploadConfigvideo',
    async (id: string | number, thunkApi) => {
        const resData = await updateConfigvideoToolupdateService(id, {
            statusVideo: StatusVideo.ready,
        });
        return resData;
    }
);

export const deleteConfigvideo = createAsyncThunk(
    'deleteConfigvideo',
    async (id: number | string, thunkApi) => {
        const resData = await deleteConfigvideoService(id);
        return resData;
    }
);

export const deleteMultipleConfigvideo = createAsyncThunk(
    'deleteMultipleConfigvideo',
    async (ids: number[] | string[], thunkApi) => {
        const resData = await deleteMultipleConfigVideoService(ids);
        return resData;
    }
);
export interface ConfigvideoState {
    listConfigvideo: Configvideo[];
    totalConfigvideo: number;
    detailConfigvideo: Configvideo | null;
    loadingApiConfigvideo: boolean;
}

const initialState: ConfigvideoState = {
    listConfigvideo: [] as Configvideo[],
    totalConfigvideo: 0,
    detailConfigvideo: null,
    loadingApiConfigvideo: false,
};

export const ConfigvideoSlice = createSlice({
    name: 'configvideo',
    initialState,
    reducers: {
        setDetailConfigvideo: (state, action: PayloadAction<Configvideo | null>) => {
            state.detailConfigvideo = action.payload;
        },
    },
    extraReducers: {
        [getAllConfigvideo.pending.toString()]: (state) => {},
        [getAllConfigvideo.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listConfigvideo = action.payload.configvideos;
            state.totalConfigvideo = action.payload.total;
        },
        [getAllConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailConfigvideo.pending.toString()]: (state) => {
            state.loadingApiConfigvideo = true;
        },
        [getDetailConfigvideo.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailConfigvideo = action.payload;
            state.loadingApiConfigvideo = false;
        },
        [getDetailConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createConfigvideo.pending.toString()]: (state) => {
            state.loadingApiConfigvideo = true;
        },
        [createConfigvideo.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateConfigvideo.pending.toString()]: (state) => {
            state.loadingApiConfigvideo = true;
        },
        [updateConfigvideo.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiSuccess('Cập nhật thành công.');

            state.listConfigvideo = state.listConfigvideo.map((configvideo) => {
                if (configvideo.id === action.payload.id) {
                    return action.payload;
                } else {
                    return configvideo;
                }
            });
        },
        [updateConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [reuploadConfigvideo.pending.toString()]: (state) => {
            state.loadingApiConfigvideo = true;
        },
        [reuploadConfigvideo.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiSuccess('Re Upload thành công.');

            state.listConfigvideo = state.listConfigvideo.map((configvideo) => {
                if (configvideo.id === action.payload.id) {
                    return action.payload;
                } else {
                    return configvideo;
                }
            });
        },
        [reuploadConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiError('Re Upload lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteConfigvideo.pending.toString()]: (state) => {
            state.loadingApiConfigvideo = true;
        },
        [deleteConfigvideo.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            state.listConfigvideo = state.listConfigvideo.filter(
                (configvideo) => configvideo.id !== action.payload.id
            );
            notiSuccess('Xóa thành công.');
        },
        [deleteConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteMultipleConfigvideo.pending.toString()]: (state) => {
            state.loadingApiConfigvideo = true;
        },
        [deleteMultipleConfigvideo.fulfilled.toString()]: (
            state,
            action: PayloadAction<Configvideo[]>
        ) => {
            state.loadingApiConfigvideo = false;
            const listPayloadid = action.payload.map((configvideo) => configvideo.id);
            state.listConfigvideo = state.listConfigvideo.filter(
                (configvideo) => !listPayloadid.includes(configvideo.id)
            );
            notiSuccess('Xóa hoàng loạt thành công.');
        },
        [deleteMultipleConfigvideo.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiConfigvideo = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailConfigvideo } = ConfigvideoSlice.actions;
export default ConfigvideoSlice.reducer;
