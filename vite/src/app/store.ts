
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import providersReducer from "../features/providers/providersSlice";
import contractsReducer from "../features/contracts/contractsSlice";
import eventsReducer from "../features/events/eventsSlice";
import marketsReducer from '../features/markets/marketsSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import accountReducer from '../features/account/accountSlice';
import walletReducer from '../features/wallet/walletSlice';

export const store = configureStore({
  reducer: {
    providers: providersReducer,
    contracts: contractsReducer,
    events: eventsReducer,
    markets: marketsReducer,
    portfolio: portfolioReducer,
    account: accountReducer,
    wallet: walletReducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // serializableCheck 비활성화
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
