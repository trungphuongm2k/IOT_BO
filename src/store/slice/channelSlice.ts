import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Channel } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import {
    createChannelService,
    deleteChannelService,
    getListChannelService,
    getDetailChannelService,
    updateChannelService,
} from '../../service/api/channelService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllChannel = createAsyncThunk('getAllChannel', async (filter: FilterDto) => {
    const resData = await getListChannelService(filter);
    console.log(resData, 'data');
    return resData;
});

export const getDetailChannel = createAsyncThunk(
    'getDetailChannel',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailChannel(null));
        const resData = await getDetailChannelService(id);
        return resData;
    }
);

export const createChannel = createAsyncThunk('createChannel', async (data: any, thunkApi) => {
    const resData = await createChannelService({
        ...data,
    });
    return resData;
});

export const updateChannel = createAsyncThunk('updateChannel', async (data: any, thunkApi) => {
    const { id } = data;
    delete data.id;
    const resData = await updateChannelService(id, {
        ...data,
    });
    return resData;
});

export const deleteChannel = createAsyncThunk(
    'deleteChannel',
    async (id: number | string, thunkApi) => {
        const resData = await deleteChannelService(id);
        return resData;
    }
);

export const deleteMultipleChannel = createAsyncThunk(
    'deleteMultipleChannel',
    async (ids: number[] | string[], thunkApi) => {
        let deleteMultiple: any[] = [];
        for (let i = 0; i < ids.length; i++) {
            deleteMultiple.push(deleteChannelService(ids[i]));
        }
        const resData = await Promise.all(deleteMultiple);
        return resData;
    }
);

export interface LanguageState {
    listChannel: Channel[];
    totalChannel: number;
    detailChannel: Channel | null;
    loadingApiChannel: boolean;
}

const initialState: LanguageState = {
    listChannel: [] as Channel[],
    totalChannel: 0,
    detailChannel: null,
    loadingApiChannel: false,
};

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        setDetailChannel: (state, action: PayloadAction<Channel | null>) => {
            state.detailChannel = action.payload;
        },
    },
    extraReducers: {
        [getAllChannel.pending.toString()]: (state) => {},
        [getAllChannel.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listChannel = action.payload.channels;
            state.totalChannel = action.payload.total;
        },
        [getAllChannel.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailChannel.pending.toString()]: (state) => {
            state.loadingApiChannel = true;
        },
        [getDetailChannel.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailChannel = action.payload;
            state.loadingApiChannel = false;
        },
        [getDetailChannel.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createChannel.pending.toString()]: (state) => {
            state.loadingApiChannel = true;
        },
        [createChannel.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createChannel.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateChannel.pending.toString()]: (state) => {
            state.loadingApiChannel = true;
        },
        [updateChannel.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiSuccess('Cập nhật thành công.');

            state.listChannel = state.listChannel.map((channel) => {
                if (channel.id === action.payload.id) {
                    return action.payload;
                } else {
                    return channel;
                }
            });
        },
        [updateChannel.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteChannel.pending.toString()]: (state) => {
            state.loadingApiChannel = true;
        },
        [deleteChannel.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            state.listChannel = state.listChannel.filter(
                (channel) => channel.id !== action.payload.id
            );
            notiSuccess('Xóa thành công.');
        },
        [deleteChannel.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteMultipleChannel.pending.toString()]: (state) => {
            state.loadingApiChannel = true;
        },
        [deleteMultipleChannel.fulfilled.toString()]: (state, action: PayloadAction<Channel[]>) => {
            state.loadingApiChannel = false;
            const listPayloadid = action.payload.map((channel) => channel.id);
            state.listChannel = state.listChannel.filter(
                (channel) => !listPayloadid.includes(channel.id)
            );
            notiSuccess('Xóa hoàng loạt thành công.');
        },
        [deleteMultipleChannel.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiChannel = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailChannel } = ChannelSlice.actions;
export default ChannelSlice.reducer;
