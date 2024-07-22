import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrowserProvider } from "ethers";

// Define the initial state for the ethers provider
interface EthersState {
  provider: BrowserProvider | null;
}

const initialState: EthersState = {
  provider: null,
};

// Create a slice for ethers provider
const ethersSlice = createSlice({
  name: "ethers",
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<BrowserProvider>) => {
      state.provider = action.payload;
    },
  },
});

// Export actions and reducer
export const { setProvider } = ethersSlice.actions;
const ethersReducer = ethersSlice.reducer;

// Configure the store
const store = configureStore({
  reducer: {
    ethers: ethersReducer,
  },
});

// Export the store type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
