/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: false,
  },
  reducers: {
    addAuth: (state, action) => {
      state.authData = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const { addAuth } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer;
