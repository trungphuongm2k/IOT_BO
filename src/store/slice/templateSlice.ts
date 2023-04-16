import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Template } from '../../interface';
import { FilterDto } from '../../interface/filterDto';
import { uploadFileService, uploadGstorageService } from '../../service';
import {
    createTemplateService,
    deleteTemplateService,
    getListTemplateService,
    getDetailTemplateService,
    updateTemplateService,
} from '../../service/api/templateService';

import { notiError, notiSuccess } from '../../utils/notification';

export const getAllTemplate = createAsyncThunk('getAllTemplate', async (filter: FilterDto) => {
    const resData = await getListTemplateService(filter);
    return resData;
});

export const getDetailTemplate = createAsyncThunk(
    'getDetailTemplate',
    async (id: number | string, thunkApi) => {
        thunkApi.dispatch(setDetailTemplate(null));
        const resData = await getDetailTemplateService(id);
        return resData;
    }
);

export const createTemplate = createAsyncThunk('createTemplate', async (data: any, thunkApi) => {
    const { name, fileTemplate, fileThumb, description, fileDemo } = data;
    const [pathFileConfig, demo, thumb] = await Promise.all([
        uploadGstorageService(fileTemplate),
        uploadGstorageService(fileDemo),
        uploadFileService('template', fileThumb),
    ]);
    const resData = await createTemplateService({
        name,
        pathFileConfig,
        thumb,
        demo,
        description,
    });
    return resData;
});

export const updateTemplate = createAsyncThunk('updateTemplate', async (data: any, thunkApi) => {
    const { id, name, fileTemplate, fileThumb, fileDemo, description } = data;
    let pathFileConfig;
    let thumb;
    let demo;

    let updateData = {
        name: name,
        description: description,
    };
    if (fileTemplate) {
        pathFileConfig = await uploadGstorageService(fileTemplate);
        Object.assign(updateData, { pathFileConfig: pathFileConfig });
    }
    if (fileDemo) {
        demo = await uploadGstorageService(fileDemo);
        Object.assign(updateData, { demo: demo });
    }

    if (fileThumb) {
        thumb = await uploadFileService('template', fileThumb);
        Object.assign(updateData, { thumb: thumb });
    }
    const resData = await updateTemplateService(id, updateData);
    return resData;
});

export const deleteTemplate = createAsyncThunk(
    'deleteTemplate',
    async (id: number | string, thunkApi) => {
        const resData = await deleteTemplateService(id);
        return resData;
    }
);

export const deleteMultipleTemplate = createAsyncThunk(
    'deleteMultipleTemplate',
    async (ids: number[] | string[], thunkApi) => {
        let deleteMultiple: any[] = [];
        for (let i = 0; i < ids.length; i++) {
            deleteMultiple.push(deleteTemplateService(ids[i]));
        }
        const resData = await Promise.all(deleteMultiple);
        return resData;
    }
);

export interface TemplateState {
    listTemplate: Template[];
    totalTemplate: number;
    detailTemplate: Template | null;
    loadingApiTemplate: boolean;
}

const initialState: TemplateState = {
    listTemplate: [] as Template[],
    totalTemplate: 0,
    detailTemplate: null,
    loadingApiTemplate: false,
};

export const TemplateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        setDetailTemplate: (state, action: PayloadAction<Template | null>) => {
            state.detailTemplate = action.payload;
        },
    },
    extraReducers: {
        [getAllTemplate.pending.toString()]: (state) => {},
        [getAllTemplate.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.listTemplate = action.payload.templates;
            state.totalTemplate = action.payload.total;
        },
        [getAllTemplate.rejected.toString()]: (state, action: PayloadAction<any>) => {
            notiError('Lỗi load dữ liệu.');
        },
        //////////////////////////////////////////////////////////////////
        [getDetailTemplate.pending.toString()]: (state) => {
            state.loadingApiTemplate = true;
        },
        [getDetailTemplate.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.detailTemplate = action.payload;
            state.loadingApiTemplate = false;
        },
        [getDetailTemplate.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiError('Lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [createTemplate.pending.toString()]: (state) => {
            state.loadingApiTemplate = true;
        },
        [createTemplate.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiSuccess('Thêm bản ghi thành công!!!');
        },
        [createTemplate.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiError('Thêm bản ghi lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [updateTemplate.pending.toString()]: (state) => {
            state.loadingApiTemplate = true;
        },
        [updateTemplate.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiSuccess('Cập nhật thành công.');

            state.listTemplate = state.listTemplate.map((template) => {
                if (template.id === action.payload.id) {
                    return action.payload;
                } else {
                    return template;
                }
            });
        },
        [updateTemplate.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiError('Cập nhật lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteTemplate.pending.toString()]: (state) => {
            state.loadingApiTemplate = true;
        },
        [deleteTemplate.fulfilled.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            state.listTemplate = state.listTemplate.filter(
                (template) => template.id !== action.payload.id
            );
            notiSuccess('Xóa thành công.');
        },
        [deleteTemplate.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
        [deleteMultipleTemplate.pending.toString()]: (state) => {
            state.loadingApiTemplate = true;
        },
        [deleteMultipleTemplate.fulfilled.toString()]: (
            state,
            action: PayloadAction<Template[]>
        ) => {
            state.loadingApiTemplate = false;
            const listPayloadid = action.payload.map((template) => template.id);
            state.listTemplate = state.listTemplate.filter(
                (template) => !listPayloadid.includes(template.id)
            );
            notiSuccess('Xóa hoàng loạt thành công.');
        },
        [deleteMultipleTemplate.rejected.toString()]: (state, action: PayloadAction<any>) => {
            state.loadingApiTemplate = false;
            notiError('Xóa lỗi.');
        },
        //////////////////////////////////////////////////////////////////
    },
});

// Action creators are generated for each case reducer function
export const { setDetailTemplate } = TemplateSlice.actions;
export default TemplateSlice.reducer;
