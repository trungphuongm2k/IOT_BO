import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from './slice/loginSlice';
import controlReducer from './slice/controlSlice';
import countryReducer from './slice/countrySlice';
import languageReducer from './slice/languageSlice';
import channelReducer from './slice/channelSlice';
import topicReducer from './slice/topicSlice';
import fontReducer from './slice/fontSlice';
import imageReducer from './slice/imageSlice';
import audioReducer from './slice/audioSlice';
import userReducer from './slice/userSlice';
import configvideoReducer from './slice/configvideoSlice';
import templateReducer from './slice/templateSlice';
import chatgptReducer from './slice/chatgptSlice';
import authorReducer from './slice/authorSlice';

export function makeStore() {
    return configureStore({
        reducer: {
            login: loginReducer,
            control: controlReducer,
            country: countryReducer,
            language: languageReducer,
            channel: channelReducer,
            topic: topicReducer,
            font: fontReducer,
            image: imageReducer,
            audio: audioReducer,
            user: userReducer,
            configvideo: configvideoReducer,
            template: templateReducer,
            chatgpt: chatgptReducer,
            author: authorReducer,
        },
    });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action<string>
>;

export default store;
