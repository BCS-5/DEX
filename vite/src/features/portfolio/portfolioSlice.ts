import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { contracts } from "../../contracts/addresses"; // 경로를 확인하고 필요하다면 수정하세요

// 새로운 fetchPortfolioData 함수 추가
export const fetchPortfolioData = createAsyncThunk(
  "portfolio/fetchPortfolioData",
  async (address: string) => {
    const [marketData, positions, orders, liquidityPositions, tradeHistory] =
      await Promise.all([
        axios.get("http://141.164.38.253:8090/api/getMarket"),
        axios.get(
          `http://141.164.38.253:8090/api/getPositions?address=${address}`
        ),
        axios.get(
          `http://141.164.38.253:8090/api/getOrders?address=${address}`
        ),
        axios.get(
          `http://141.164.38.253:8090/api/getLiquidityPositions?address=${address}`
        ),
        axios.get(
          `http://141.164.38.253:8090/api/getTradeHistory?address=${address}`
        ),
      ]);

    return {
      marketData: marketData.data,
      positions: positions.data,
      orders: orders.data,
      liquidityPositions: liquidityPositions.data,
      tradeHistory: tradeHistory.data,
    };
  }
);

// 기존 API 호출 함수들 유지
export const fetchMarketData = createAsyncThunk(
  "portfolio/fetchMarketData",
  async () => {
    const response = await axios.get(
      "http://141.164.38.253:8090/api/getMarket"
    );
    return response.data;
  }
);

export const fetchUserPositions = createAsyncThunk(
  "portfolio/fetchUserPositions",
  async (address: string) => {
    const response = await axios.get(
      `http://141.164.38.253:8090/api/getPositions?address=${address}`
    );
    return response.data;
  }
);

export const fetchUserOrders = createAsyncThunk(
  "portfolio/fetchUserOrders",
  async (address: string) => {
    const response = await axios.get(
      `http://141.164.38.253:8090/api/getOrders?address=${address}`
    );
    return response.data;
  }
);

export const fetchUserLiquidityPositions = createAsyncThunk(
  "portfolio/fetchUserLiquidityPositions",
  async (address: string) => {
    const response = await axios.get(
      `http://141.164.38.253:8090/api/getLiquidityPositions?address=${address}`
    );
    return response.data;
  }
);

export const fetchTradeHistory = createAsyncThunk(
  "portfolio/fetchTradeHistory",
  async (address: string) => {
    const response = await axios.get(
      `http://141.164.38.253:8090/api/getTradeHistory?address=${address}`
    );
    return response.data;
  }
);

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
  totalValue: "0",
  freeCollateral: "0",
  totalVolume: "0",
  positions: [],
  orders: [],
  liquidityPositions: [],
  tradeHistory: [],
  isLoading: false,
  error: null,
};

export const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchMarketData.fulfilled,
        (
          state,
          action: PayloadAction<{
            tradingVolume24h: string;
            openInterestCurrent: string;
          }>
        ) => {
          state.isLoading = false;
          state.totalVolume = action.payload.tradingVolume24h;
          state.totalValue = action.payload.openInterestCurrent;
          // freeCollateral 계산: totalValue - 사용 중인 담보
          state.freeCollateral = (
            parseFloat(state.totalValue) - parseFloat(state.totalVolume)
          ).toString();
        }
      )
      .addCase(fetchMarketData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(
        fetchUserPositions.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.positions = action.payload;
        }
      )
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.orders = action.payload;
        }
      )
      .addCase(
        fetchUserLiquidityPositions.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.liquidityPositions = action.payload;
        }
      )
      .addCase(
        fetchTradeHistory.fulfilled,
        (state, action: PayloadAction<any[]>) => {
          state.tradeHistory = action.payload;
        }
      )
      .addCase(fetchPortfolioData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPortfolioData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalVolume = action.payload.marketData.tradingVolume24h;
        state.totalValue = action.payload.marketData.openInterestCurrent;
        state.freeCollateral = (
          parseFloat(state.totalValue) - parseFloat(state.totalVolume)
        ).toString();
        state.positions = action.payload.positions;
        state.orders = action.payload.orders;
        state.liquidityPositions = action.payload.liquidityPositions;
        state.tradeHistory = action.payload.tradeHistory;
      })
      .addCase(fetchPortfolioData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export default portfolioSlice.reducer;
