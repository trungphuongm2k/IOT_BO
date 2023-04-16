import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Country } from "../../interface";
import { FilterDto } from "../../interface/filterDto";
import {
  createCountryService,
  deleteCountryService,
  getListCountryService,
  getDetailCountryService,
  updateCountryService,
} from "../../service/api/countryService";

import { notiError, notiSuccess } from "../../utils/notification";

export const getAllCountry = createAsyncThunk(
  "getAllCountry",
  async (filter: FilterDto) => {
    const resData = await getListCountryService(filter);
    return resData;
  }
);

export const getDetailCountry = createAsyncThunk(
  "getDetailCountry",
  async (id: number | string, thunkApi) => {
    thunkApi.dispatch(setDetailCountry(null));
    const resData = await getDetailCountryService(id);
    return resData;
  }
);

export const createCountry = createAsyncThunk(
  "createCountry",
  async (data: any, thunkApi) => {
    const { name, code } = data;
    const resData = await createCountryService({
      name,
      code,
    });
    return resData;
  }
);

export const updateCountry = createAsyncThunk(
  "updateCountry",
  async (data: any, thunkApi) => {
    const { id, name, code } = data;
    const resData = await updateCountryService(id, {
      name,
      code,
    });
    return resData;
  }
);

export const deleteCountry = createAsyncThunk(
  "deleteCountry",
  async (id: number | string, thunkApi) => {
    const resData = await deleteCountryService(id);
    return resData;
  }
);

export interface CateMovieState {
  listCountry: Country[];
  totalCountry: number;
  detailCountry: Country | null;
  loadingApiCountry: boolean;
}

const initialState: CateMovieState = {
  listCountry: [] as Country[],
  totalCountry: 0,
  detailCountry: null,
  loadingApiCountry: false,
};

export const CountrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setDetailCountry: (state, action: PayloadAction<Country | null>) => {
      state.detailCountry = action.payload;
    },
  },
  extraReducers: {
    [getAllCountry.pending.toString()]: (state) => {},
    [getAllCountry.fulfilled.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.listCountry = action.payload.devices;
      state.totalCountry = action.payload.total;
    },
    [getAllCountry.rejected.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      notiError("Lỗi load dữ liệu.");
    },
    //////////////////////////////////////////////////////////////////
    [getDetailCountry.pending.toString()]: (state) => {
      state.loadingApiCountry = true;
    },
    [getDetailCountry.fulfilled.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.detailCountry = action.payload;
      state.loadingApiCountry = false;
    },
    [getDetailCountry.rejected.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      notiError("Lỗi.");
    },
    //////////////////////////////////////////////////////////////////
    [createCountry.pending.toString()]: (state) => {
      state.loadingApiCountry = true;
    },
    [createCountry.fulfilled.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      notiSuccess("Thêm bản ghi thành công!!!");
    },
    [createCountry.rejected.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      notiError("Thêm bản ghi lỗi.");
    },
    //////////////////////////////////////////////////////////////////
    [updateCountry.pending.toString()]: (state) => {
      state.loadingApiCountry = true;
    },
    [updateCountry.fulfilled.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      notiSuccess("Cập nhật thành công.");

      state.listCountry = state.listCountry.map((country) => {
        if (country.id === action.payload.id) {
          return action.payload;
        } else {
          return country;
        }
      });
    },
    [updateCountry.rejected.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      notiError("Cập nhật lỗi.");
    },
    //////////////////////////////////////////////////////////////////
    [deleteCountry.pending.toString()]: (state) => {
      state.loadingApiCountry = true;
    },
    [deleteCountry.fulfilled.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      state.listCountry = state.listCountry.filter(
        (country) => country.id !== action.payload.id
      );
      notiSuccess("Xóa thành công.");
    },
    [deleteCountry.rejected.toString()]: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loadingApiCountry = false;
      notiError("Xóa lỗi.");
    },
    //////////////////////////////////////////////////////////////////
  },
});

// Action creators are generated for each case reducer function
export const { setDetailCountry } = CountrySlice.actions;
export default CountrySlice.reducer;
