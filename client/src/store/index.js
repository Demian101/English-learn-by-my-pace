import { configureStore } from "@reduxjs/toolkit";
import { wordsApi } from "./api/wordsApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authSlice } from "./reducer/authSlice";
// import studentApi from "./api/studentApi";

const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer,
    // [studentApi.reducerPath]:studentApi.reducer,
    auth: authSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      wordsApi.middleware
      // studentApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
