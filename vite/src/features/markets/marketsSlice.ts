import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Market {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  category: string;
}

interface MarketState {
  summary: {
    tradingVolume: number;
    openInterest: number;
    earnedByStakers: number;
  };
  list: Market[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MarketState = {
  summary: {
    tradingVolume: 0,
    openInterest: 0,
    earnedByStakers: 0,
  },
  list: [],
  status: 'idle',
  error: null,
};

const assignCategory = (market: Market): string => {
  if (market.symbol === 'btc' || market.symbol === 'eth') return 'Layer 1';
  if (market.symbol === 'matic' || market.symbol === 'arb') return 'Layer 2';
  if (market.symbol === 'uni' || market.symbol === 'aave') return 'DeFi';
  if (market.symbol === 'ape' || market.symbol === 'sand') return 'NFT';
  if (market.symbol === 'axs' || market.symbol === 'mana') return 'Gaming';
  return 'Other';
};

export const fetchMarkets = createAsyncThunk<Market[], void, { rejectValue: string }>(
  'markets/fetchMarkets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Market[]>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      return response.data.map(market => ({
        ...market,
        category: assignCategory(market),
      }));
    } catch (error) {
      return rejectWithValue('Failed to fetch markets');
    }
  }
);

const marketsSlice = createSlice({
  name: 'markets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarkets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMarkets.fulfilled, (state, action: PayloadAction<Market[]>) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.summary.tradingVolume = action.payload.reduce((sum, market) => sum + market.total_volume, 0);
        state.summary.openInterest = action.payload.reduce((sum, market) => sum + market.market_cap, 0) / 100;
        state.summary.earnedByStakers = state.summary.tradingVolume * 0.0002;
      })
      .addCase(fetchMarkets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch markets';
      });
  },
});

export default marketsSlice.reducer;