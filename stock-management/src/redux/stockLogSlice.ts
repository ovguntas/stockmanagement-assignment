import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiRequest } from '../api/ApiRequest';

export interface StockLog {
  _id: string;
  productId: string;
  productName: string;
  previousQuantity: number;
  newQuantity: number;
  operationType: 'decrease' | 'update';
  timestamp: string;
}

interface StockLogState {
  logs: StockLog[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StockLogState = {
  logs: [],
  status: 'idle',
  error: null
};

export const fetchStockLogs = createAsyncThunk<StockLog[]>(
  'stockLogs/fetchStockLogs',
  async () => {
    const response = await ApiRequest.getStockLogs();
    return response;
  }
);

const stockLogSlice = createSlice({
  name: 'stockLogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStockLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchStockLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  }
});

export default stockLogSlice.reducer; 