import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Topic } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import {
    createTopicService,
    deleteTopicService,
    getListTopicService,
    getDetailTopicService,
    updateTopicService,
} from '../../service/api/topicService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllTopic = createAsyncThunk('getAllTopic', async (filter: FilterDto) => {
    const resData = await getListTopicService(filter);
    return resData;
});

export const getDetailTopic = createAsyncThunk(
    'getDetailTopic',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailTopic(null));
        const resData = await getDetailTopicService(id);
        return resData;
    }
);

export const createTopic = createAsyncThunk('createTopic', async (data: any, thunkApi) => {
    const { name, code } = data;
    const resData = await createTopicService({
        name,
        code,
    });
    return resData;
});

export const updateTopic = createAsyncThunk('updateTopic', async (data: any, thunkApi) => {
    const { id, name, code } = data;
    const resData = await updateTopicService(id, {
        name,
        code,
    });
    return resData;
});

export const deleteTopic = createAsyncThunk(
    'deleteTopic',
    async (id: number | string, thunkApi) => {
        const resData = await deleteTopicService(id);
        return resData;
    }
);

export interface TopicState {
    listTopic: Topic[];
    totalTopic: number;
    detailTopic: Topic | null;
    loadingApiTopic: boolean;
}

const initialState: TopicState = {
    listTopic: [] as Topic[],
    totalTopic: 0,
    detailTopic: null,
    loadingApiTopic: false,
};

export const TopicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {
        setDetailTopic: (state, action: PayloadAction<Topic | null>) => {
            state.detailTopic = action.payload;
        },
    },
    extraReducers: {
        [getAllTopic.pending.toString()]: (state) => {},
        [getAllTopic.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listTopic = action.payload.topics;
            state.totalTopic = action.payload.total;
        },
        [getAllTopic.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailTopic.pending.toString()]: (state) => {
            state.loadingApiTopic = true;
        },
        [getDetailTopic.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailTopic = action.payload;
            state.loadingApiTopic = false;
        },
        [getDetailTopic.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createTopic.pending.toString()]: (state) => {
            state.loadingApiTopic = true;
        },
        [createTopic.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createTopic.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateTopic.pending.toString()]: (state) => {
            state.loadingApiTopic = true;
        },
        [updateTopic.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            notiSuccess('Cập nhật thành công.');

            state.listTopic = state.listTopic.map((topic) => {
                if (topic.id === action.payload.id) {
                    return action.payload;
                } else {
                    return topic;
                }
            });
        },
        [updateTopic.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteTopic.pending.toString()]: (state) => {
            state.loadingApiTopic = true;
        },
        [deleteTopic.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            state.listTopic = state.listTopic.filter((country) => country.id !== action.payload.id);
            notiSuccess('Xóa thành công.');
        },
        [deleteTopic.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTopic = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailTopic } = TopicSlice.actions;
export default TopicSlice.reducer;
