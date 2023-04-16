import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatGpt } from '../../interface';
import { questionFromUser } from '../../service/api/chatGptService';

import { notiError, notiSuccess } from '../../utils/notification';

export const userSendQuestion = createAsyncThunk('userSendQuestion', async (question: string) => {
    const resData = await questionFromUser(question);
    return {
        question,
        result: resData,
    };
});
export const userAutoContent = createAsyncThunk('userAutoContent', async (data: {
    title: string;
    description: string;
}) => {
    const [resTitle, resDescription] = await Promise.all([questionFromUser(data.title), questionFromUser(data.description)]);
    return {
        resTitle, resDescription,
    };
});

export interface ChatGptState {
    listResult: {
        question: string;
        result: ChatGpt;
    }[];
    loadingGpt: boolean;
}

const initialState: ChatGptState = {
    listResult: [] as {
        question: string;
        result: ChatGpt;
    }[],
    loadingGpt: false,
};

export const ChatGptSlice = createSlice({
    name: 'chatgptvideo',
    initialState,
    reducers: {},
    extraReducers: {
        [userSendQuestion.pending.toString()]: (state) => {
            state.loadingGpt = true;
        },
        [userSendQuestion.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingGpt = false;
            state.listResult.push(action.payload);
        },
        [userSendQuestion.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingGpt = false;
            notiError('Lỗi gửi dữ liệu.');
        },
        //---------------------------------------------------------------------------------------------------------------
        [userAutoContent.pending.toString()]: (state) => {
            state.loadingGpt = true;
        },
        [userAutoContent.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingGpt = false;
        },
        [userAutoContent.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingGpt = false;
            notiError('Tạo content thất bại');
        },
    },
});

// Action creators are generated for each case reducer function
export default ChatGptSlice.reducer;
