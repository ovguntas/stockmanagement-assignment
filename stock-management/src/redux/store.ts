import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import modalsReducer from "./modalsSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    modals: modalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
