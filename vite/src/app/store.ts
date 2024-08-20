import { configureStore } from "@reduxjs/toolkit";
import providersReducer from "../features/providers/providersSlice";
import contractsReducer from "../features/contracts/contractsSlice";
import eventsReducer from "../features/events/eventsSlice";

export const store = configureStore({
  reducer: {
    providers: providersReducer,
    contracts: contractsReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // serializableCheck 비활성화
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
