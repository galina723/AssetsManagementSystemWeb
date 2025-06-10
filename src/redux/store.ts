import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/authReducer";
import { sidebarReducer } from "./reducers/sidebarReducer";

const store = configureStore({
  reducer: {
    authReducer,
    sidebarReducer,
  },
});

export default store;
