import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Audio } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import { uploadFileService, uploadGstorageService } from '../../service';
import {
    createAudioService,
    deleteAudioService,
    getListAudioService,
    getDetailAudioService,
    updateAudioService,
} from '../../service/api/audioService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllAudio = createAsyncThunk('getAllAudio', async (filter: FilterDto) => {
    const resData = await getListAudioService(filter);
    return resData;
});

export const getDetailAudio = createAsyncThunk(
    'getDetailAudio',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailAudio(null));
        const resData = await getDetailAudioService(id);
        return resData;
    }
);

export const createAudio = createAsyncThunk('createAudio', async (data: any, thunkApi) => {
    const { fileAudio, fileThumb } = data;
    const path = await uploadGstorageService(fileAudio);
    const thumb = await uploadFileService('audio', fileThumb);
    data.fileAudio = undefined;
    data.fileThumb = undefined;
    const resData = await createAudioService({
        path,
        thumb,
        ...data,
    });
    return resData;
});

export const updateAudio = createAsyncThunk('updateAudio', async (data: any, thunkApi) => {
    const { id, fileAudio, fileThumb } = data;
    let path, thumb;
    let updateData = {
        ...data,
    };
    updateData.id = undefined;
    if (fileAudio) {
        path = await uploadGstorageService(fileAudio);
        updateData.path = path;
    }
    if (fileThumb) {
        thumb = await uploadFileService('audio', fileThumb);
        updateData.thumb = thumb;
    }
    updateData.fileAudio = undefined;
    updateData.fileThumb = undefined;
    const resData = await updateAudioService(id, updateData);
    return resData;
});

export const deleteAudio = createAsyncThunk(
    'deleteAudio',
    async (id: number | string, thunkApi) => {
        const resData = await deleteAudioService(id);
        return resData;
    }
);

export const deleteMultipleAudio = createAsyncThunk(
    'deleteMultipleAudio',
    async (ids: number[] | string[], thunkApi) => {
        let deleteMultiple: any[] = [];
        for (let i = 0; i < ids.length; i++) {
            deleteMultiple.push(deleteAudioService(ids[i]));
        }
        const resData = await Promise.all(deleteMultiple);
        return resData;
    }
);

export interface AudioState {
    listAudio: Audio[];
    totalAudio: number;
    detailAudio: Audio | null;
    loadingApiAudio: boolean;
}

const initialState: AudioState = {
    listAudio: [] as Audio[],
    totalAudio: 0,
    detailAudio: null,
    loadingApiAudio: false,
};

export const AudioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        setDetailAudio: (state, action: PayloadAction<Audio | null>) => {
            state.detailAudio = action.payload;
        },
    },
    extraReducers: {
        [getAllAudio.pending.toString()]: (state) => {},
        [getAllAudio.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listAudio = action.payload.audios;
            state.totalAudio = action.payload.total;
        },
        [getAllAudio.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailAudio.pending.toString()]: (state) => {
            state.loadingApiAudio = true;
        },
        [getDetailAudio.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailAudio = action.payload;
            state.loadingApiAudio = false;
        },
        [getDetailAudio.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createAudio.pending.toString()]: (state) => {
            state.loadingApiAudio = true;
        },
        [createAudio.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createAudio.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateAudio.pending.toString()]: (state) => {
            state.loadingApiAudio = true;
        },
        [updateAudio.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiSuccess('Cập nhật thành công.');

            state.listAudio = state.listAudio.map((audio) => {
                if (audio.id === action.payload.id) {
                    return action.payload;
                } else {
                    return audio;
                }
            });
        },
        [updateAudio.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteAudio.pending.toString()]: (state) => {
            state.loadingApiAudio = true;
        },
        [deleteAudio.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            state.listAudio = state.listAudio.filter((audio) => audio.id !== action.payload.id);
            notiSuccess('Xóa thành công.');
        },
        [deleteAudio.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteMultipleAudio.pending.toString()]: (state) => {
            state.loadingApiAudio = true;
        },
        [deleteMultipleAudio.fulfilled.toString()]: (state, action: PayloadAction<Audio[]>) => {
            state.loadingApiAudio = false;
            const listPayloadid = action.payload.map((audio) => audio.id);
            state.listAudio = state.listAudio.filter((audio) => !listPayloadid.includes(audio.id));
            notiSuccess('Xóa hoàng loạt thành công.');
        },
        [deleteMultipleAudio.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiAudio = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailAudio } = AudioSlice.actions;
export default AudioSlice.reducer;
