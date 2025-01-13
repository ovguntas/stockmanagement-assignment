import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isAddProductOpen: boolean;
  isStockUpdateOpen: boolean;
}

const initialState: ModalState = {
  isAddProductOpen: false,
  isStockUpdateOpen: false,
};

const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    handleAddProductModal: (state, action: PayloadAction<boolean>) => {
      state.isAddProductOpen = action.payload;
    },
    handleStockUpdateModal: (state, action: PayloadAction<boolean>) => {
      state.isStockUpdateOpen = action.payload;
    },
  },
});

export const { handleAddProductModal, handleStockUpdateModal } =
  modalsSlice.actions;
export default modalsSlice.reducer;
