import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductInput } from "../types/product";
import { ApiRequest } from "../api/ApiRequest";

export const fetchProducts = createAsyncThunk<Product[], void>(
  "products/fetchProducts",
  async () => {
    const response = await ApiRequest.getAllProducts("/products");
    return response;
  }
);

export const updateProductAsync = createAsyncThunk<Product, { id: string; product: ProductInput }>(
  "products/updateProduct",
  async ({ id, product }) => {
    const response = await ApiRequest.updateProduct(id, product);
    return response;
  }
);

export const deleteProductAsync = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id) => {
    await ApiRequest.deleteProduct(id);
    return id;
  }
);

interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchTerm: string;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  searchTerm: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    useProduct: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const product = state.products.find((p) => p._id === action.payload.id);
      if (product) {
        product.quantity = Math.max(
          0,
          product.quantity - action.payload.amount
        );
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },

    // api call entegre edilmiş hali 
    addProductToState: (state, action) => {
      state.products.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const {
  addProduct,
  updateProduct,
  removeProduct,
  useProduct,
  setSearchTerm,
  addProductToState
} = productSlice.actions;
export default productSlice.reducer;
