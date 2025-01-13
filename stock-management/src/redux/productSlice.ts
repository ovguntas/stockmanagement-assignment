import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product';
import { mockProducts } from '../mockdata/products';


interface ProductState {
  products: Product[];
  searchTerm: string;
}

const initialState: ProductState = {
  products: mockProducts,
  searchTerm: '',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    useProduct: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id);
      if (product) {
        product.quantity = Math.max(0, product.quantity - action.payload.amount);
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { addProduct, updateProduct, removeProduct, useProduct, setSearchTerm } = productSlice.actions;
export default productSlice.reducer;

