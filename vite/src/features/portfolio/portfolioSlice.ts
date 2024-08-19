import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../app/store';
import { ethers } from 'ethers';
import { contracts } from '../../contracts/addresses';

interface Position {
  id: string;
  pair: string;
  size: string;
  entryPrice: string;
  leverage: string;
  liquidationPrice: string;
  unrealizedPnl: string;
}

interface Order {
  id: string;
  pair: string;
  type: 'limit' | 'market';
  side: 'long' | 'short';
  size: string;
  price: string;
  status: 'open' | 'filled' | 'cancelled';
}

interface LiquidityPosition {
  id: string;
  pair: string;
  amount: string;
  lowerTick: number;
  upperTick: number;
}

interface TradeHistoryItem {
  id: string;
  timestamp: number;
  pair: string;
  type: 'open' | 'close' | 'liquidation';
  side: 'long' | 'short';
  size: string;
  price: string;
  realizedPnl: string;
}

interface PortfolioState {
  positions: Position[];
  orders: Order[];
  liquidityPositions: LiquidityPosition[];
  tradeHistory: TradeHistoryItem[];
  totalValue: string;
  freeCollateral: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  positions: [],
  orders: [],
  liquidityPositions: [],
  tradeHistory: [],
  totalValue: '0',
  freeCollateral: '0',
  isLoading: false,
  error: null,
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updatePositions: (state, action: PayloadAction<Position[]>) => {
      state.positions = action.payload;
    },
    updateOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    updateLiquidityPositions: (state, action: PayloadAction<LiquidityPosition[]>) => {
      state.liquidityPositions = action.payload;
    },
    updateTradeHistory: (state, action: PayloadAction<TradeHistoryItem[]>) => {
      state.tradeHistory = action.payload;
    },
    updateTotalValue: (state, action: PayloadAction<string>) => {
      state.totalValue = action.payload;
    },
    updateFreeCollateral: (state, action: PayloadAction<string>) => {
      state.freeCollateral = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  updatePositions,
  updateOrders,
  updateLiquidityPositions,
  updateTradeHistory,
  updateTotalValue,
  updateFreeCollateral,
} = portfolioSlice.actions;

export const fetchPortfolioData = (): AppThunk => async (dispatch, getState) => {
  const { signer } = getState().wallet;
  if (!signer) return;

  dispatch(setLoading(true));
  try {
    const vaultContract = new ethers.Contract(contracts.vault.address, contracts.vault.abi, signer);
    const clearingHouseContract = new ethers.Contract(contracts.clearingHouse.address, contracts.clearingHouse.abi, signer);
    
    const address = await signer.getAddress();
    
    const totalCollateral = await vaultContract.getTotalCollateral(address);
    const freeCollateral = await vaultContract.getFreeCollateral(address);
    
    const positions = await clearingHouseContract.getPositions(address);
    const orders = await clearingHouseContract.getOpenOrders(address);
    const liquidityPositions = await clearingHouseContract.getLiquidityPositions(address);
    const tradeHistory = await clearingHouseContract.getTradeHistory(address);

    dispatch(updatePositions(positions));
    dispatch(updateOrders(orders));
    dispatch(updateLiquidityPositions(liquidityPositions));
    dispatch(updateTradeHistory(tradeHistory));
    dispatch(updateTotalValue(ethers.formatUnits(totalCollateral, 6)));
    dispatch(updateFreeCollateral(ethers.formatUnits(freeCollateral, 6)));

    dispatch(setError(null));
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    dispatch(setError('Failed to fetch portfolio data'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default portfolioSlice.reducer;