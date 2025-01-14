import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductInput } from "../types/product";
import { ApiRequest } from "../api/ApiRequest";

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, search = '', limit = 10 }: { page?: number; search?: string; limit?: number }) => {
    try {
      const response = await ApiRequest.getAllProducts(page, limit, search);
      return {
        products: response.products,
        total: response.total
      };
    } catch (error: any) {
      throw new Error(error.message || "Ürünler yüklenirken bir hata oluştu");
    }
  }
);

export const updateProductAsync = createAsyncThunk<
  Product,
  { id: string; product: Partial<Product> }
>("products/updateProduct", async ({ id, product }) => {
  try {
    const response = await ApiRequest.updateProduct(id, product as ProductInput);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Ürün güncellenirken bir hata oluştu");
  }
});

export const deleteProductAsync = createAsyncThunk<string, string>(
  "products/deleteProduct",
  async (id) => {
    try {
      await ApiRequest.deleteProduct(id);
      return id;
    } catch (error: any) {
      throw new Error(error.message || "Ürün silinirken bir hata oluştu");
    }
  }
);

interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  total: number;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  searchTerm: "",
  currentPage: 1,
  totalPages: 1,
  total: 0,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.total = action.payload.total;
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

export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
