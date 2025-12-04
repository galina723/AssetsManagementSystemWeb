/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    sidebarData: "home",
  },
  reducers: {
    addSidebar: (state, action) => {
      state.sidebarData = action.payload;
    },
  },
});

export const sidebarReducer = sidebarSlice.reducer;
export const { addSidebar } = sidebarSlice.actions;
export const sidebarSelector = (state: any) => state.sidebarReducer;
