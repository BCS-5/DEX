import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  signer: any | null;
  provider: any | null;
}

const initialState: WalletState = {
  signer: null,
  provider: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSigner: (state, action: PayloadAction<any>) => {
      state.signer = action.payload;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
  },
});

export const { setSigner, setProvider } = walletSlice.actions;
export default walletSlice.reducer;