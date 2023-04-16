import {
  Action,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export const test = createAsyncThunk("test", async (data: any, thunkAPI) => {
  try {
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});

export interface ControlState {
  isNavActive: boolean;
}

const initialState: ControlState = {
  isNavActive: true,
};

export const ControlSlice = createSlice({
  name: "control",
  initialState,
  reducers: {
    setNavActive: (state, action: PayloadAction<boolean>) => {
      state.isNavActive = action.payload;
    },
  },
  extraReducers: {
    // [test.pending.toString()]: (state) => {
    //     state.loadingLogin = true;
    // },
    // [test.fulfilled.toString()]: (
    //     state,
    //     action: PayloadAction<any>
    // ) => {},
    // [test.rejected.toString()]: (
    //     state,
    //     action: PayloadAction<any>
    // ) => {},
    // //////////////////////////////////////////////////////////////////
  },
});

// Action creators are generated for each case reducer function
export const { setNavActive } = ControlSlice.actions;
export default ControlSlice.reducer;
