import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AccountState {
  balances: { [key: string]: number };
}

export const initialState: AccountState = {
  balances: {},
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<{ currency: string; amount: number }>) => {
      state.balances[action.payload.currency] = action.payload.amount;
    },
  },
});

export const { setBalance } = accountSlice.actions;

export default accountSlice.reducer;