import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import modalsReducer from "./modalsSlice";
import stockLogReducer from "./stockLogSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    modals: modalsReducer,
    stockLogs: stockLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
