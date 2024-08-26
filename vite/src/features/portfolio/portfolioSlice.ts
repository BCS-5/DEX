import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API 호출 함수들
export const fetchMarketData = createAsyncThunk('portfolio/fetchMarketData', async () => {
  const response = await axios.get('https://141.164.38.253:8090/api/getMarket');
  return response.data;
});

export const fetchUserPositions = createAsyncThunk('portfolio/fetchUserPositions', async (address: string) => {
  const response = await axios.get(`https://141.164.38.253:8090/api/getPositions?address=${address}`);
  return response.data;
});

export const fetchUserOrders = createAsyncThunk('portfolio/fetchUserOrders', async (address: string) => {
  const response = await axios.get(`https://141.164.38.253:8090/api/getOrders?address=${address}`);
  return response.data;
});

export const fetchUserLiquidityPositions = createAsyncThunk('portfolio/fetchUserLiquidityPositions', async (address: string) => {
  const response = await axios.get(`https://141.164.38.253:8090/api/getLiquidityPositions?address=${address}`);
  return response.data;
});

export const fetchTradeHistory = createAsyncThunk('portfolio/fetchTradeHistory', async (address: string) => {
  const response = await axios.get(`https://141.164.38.253:8090/api/getTradeHistory?address=${address}`);
  return response.data;
});

export interface PortfolioState {
  totalValue: string;
  freeCollateral: string;
  totalVolume: string;
  positions: any[];
  orders: any[];
  liquidityPositions: any[];
  tradeHistory: any[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: PortfolioState = {
  totalValue: '0',
  freeCollateral: '0',
  totalVolume: '0',
  positions: [],
  orders: [],
  liquidityPositions: [],
  tradeHistory: [],
  isLoading: false,
  error: null,
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMarketData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalVolume = action.payload.tradingVolume24h;
        state.totalValue = action.payload.openInterestCurrent;
        // freeCollateral 계산: totalValue - 사용 중인 담보
        state.freeCollateral = (parseFloat(state.totalValue) - parseFloat(state.totalVolume)).toString();
      })
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchUserPositions.fulfilled, (state, action) => {
        state.positions = action.payload;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchUserLiquidityPositions.fulfilled, (state, action) => {
        state.liquidityPositions = action.payload;
      })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.tradeHistory = action.payload;
      });
  },
});

export default portfolioSlice.reducer;