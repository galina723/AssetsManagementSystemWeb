"use client";

import { Provider } from "react-redux";
import store from "@/reduxs/store";
import Main from "./main";

export default function Home() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
