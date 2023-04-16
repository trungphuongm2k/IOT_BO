import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Image } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import { uploadFileService } from '../../service';
import {
    createImageService,
    deleteImageService,
    getListImageService,
    getDetailImageService,
    updateImageService,
} from '../../service/api/imageService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllImage = createAsyncThunk('getAllImage', async (filter: FilterDto) => {
    const resData = await getListImageService(filter);
    return resData;
});

export const getDetailImage = createAsyncThunk(
    'getDetailImage',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailImage(null));
        const resData = await getDetailImageService(id);
        return resData;
    }
);

export const createImage = createAsyncThunk('createImage', async (data: any, thunkApi) => {
    const { name, fileImage } = data;
    const path = await uploadFileService('image', fileImage);
    const resData = await createImageService({
        name,
        path,
    });
    return resData;
});

export const updateImage = createAsyncThunk('updateImage', async (data: any, thunkApi) => {
    const { id, name, fileImage } = data;
    let path;
    let updateData = {
        name: name,
    };
    if (fileImage) {
        path = await uploadFileService('image', fileImage);
        Object.assign(updateData, { path: path });
    }

    const resData = await updateImageService(id, updateData);
    return resData;
});

export const deleteImage = createAsyncThunk(
    'deleteImage',
    async (id: number | string, thunkApi) => {
        const resData = await deleteImageService(id);
        return resData;
    }
);

export interface ImageState {
    listImage: Image[];
    totalImage: number;
    detailImage: Image | null;
    loadingApiImage: boolean;
}

const initialState: ImageState = {
    listImage: [] as Image[],
    totalImage: 0,
    detailImage: null,
    loadingApiImage: false,
};

export const ImageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setDetailImage: (state, action: PayloadAction<Image | null>) => {
            state.detailImage = action.payload;
        },
    },
    extraReducers: {
        [getAllImage.pending.toString()]: (state) => {},
        [getAllImage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listImage = action.payload.images;
            state.totalImage = action.payload.total;
        },
        [getAllImage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailImage.pending.toString()]: (state) => {
            state.loadingApiImage = true;
        },
        [getDetailImage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailImage = action.payload;
            state.loadingApiImage = false;
        },
        [getDetailImage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createImage.pending.toString()]: (state) => {
            state.loadingApiImage = true;
        },
        [createImage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createImage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateImage.pending.toString()]: (state) => {
            state.loadingApiImage = true;
        },
        [updateImage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            notiSuccess('Cập nhật thành công.');

            state.listImage = state.listImage.map((image) => {
                if (image.id === action.payload.id) {
                    return action.payload;
                } else {
                    return image;
                }
            });
        },
        [updateImage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteImage.pending.toString()]: (state) => {
            state.loadingApiImage = true;
        },
        [deleteImage.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            state.listImage = state.listImage.filter((image) => image.id !== action.payload.id);
            notiSuccess('Xóa thành công.');
        },
        [deleteImage.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiImage = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailImage } = ImageSlice.actions;
export default ImageSlice.reducer;
